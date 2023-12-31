const args = process.argv;
const leads = Number(getArg('-l'));
const bights = Number(getArg('-b'));
const teeth = Number(getArg('-t'));
const img = hasFlag('img');
const letters = 'abcdefghijklmnopqrstuvwxyz';
const offset = 1 + (leads % 2);
const padding = 2// visual gaps between bights
const pad = padding * (2 + (leads % 2));
const tstep = teeth / bights;// number of teeth between bights
const bstep = leads / 2;// number of bights to skip

if (!leads || !bights || !teeth) {
    console.log(`missing required parameters
    usage:
    node index.js -l <leads> -b <bights> -t <teeth> [img]
    -l  number of leads         [required]
    -b  number of bights        [required]
    -t  number of teeths        [required]
    img show pics of each step  [optional]
    `);
} else {
    console.log(`steps to create turks head with
    ${bights} bights
    ${leads} leads
    on a jig with ${teeth} teeth
    wrap going clockwise
    `);
    getSteps(bights, leads, teeth);
}

function getSteps(b, l) {
    if (hasCommonDenominator(b, l)) {
        console.log(`can't make turks head with ${b} bights and ${l} leads`);
        return;
    }
    const tob = (side) => {
        return side ? 'top' : 'bottom';
    };
    let side = true;
    let steps = {};
    let bight = 0;
    let tooth = 0;
    const h = (bstep * pad) - 1;
    const w = b * pad;
    let knot = (() => {
        let out = [];
        for (let r = 0; r < h; r++) {
            let row = [];
            for (let c = 0; c < w; c++) {
                row.push(0);
            }
            out.push(row);
        }
        return out;
    })();
    steps[0] = {
        tooth: tooth + 1,
        bight: bight + 1,
        side: tob(side),
        pass1: 0
    };
    for (let i = 0; i < b * 2; i++) {
        let pattern = [];
        let pass1 = 0;
        let next = {
            bight,
            tooth,
            side: !side
        };
        next.bight -= l / 2;
        while (next.bight < 0) {
            next.bight += b;
            pass1++;
        }
        next.tooth = Math.round(next.bight * tstep);
        const segId = getSeg(i);
        for (let j = 0; j < h; j++) {
            let c = Math.round((bight) * pad) - (j + 1);
            while (c < 0) {
                c += b * pad;
            }
            const r = Math.round((h - 1) * (+!side) + (j) * (side ? 1 : -1));
            const cross = knot[r][c];
            const node = {
                segId,
                from: {
                    tooth: tooth + 1,
                    bight: bight + 1,
                    side
                },
                to: {
                    tooth: next.tooth + 1,
                    bight: next.bight + 1,
                    side: next.side
                }
            };
            if (cross === 0) {
                knot[r][c] = [node];
            } else {
                let pass;
                const instance = Math.floor((r + 1) / (pad / padding));
                if (node.from.side) {
                    // from the top
                    if (instance % 2 === 0) {
                    // if (isSame) {
                        // going over same
                        knot[r][c].splice(0, 0, node);
                        pass = 'o';
                    } else {
                        // going under opposite
                        knot[r][c].push(node);
                        pass = 'u';
                    }
                } else {
                    // from the bottom
                    if (instance % 2 === 0) {
                    // if (isSame) {
                        // going under same
                        knot[r][c].push(node);
                        pass = 'u';
                    } else {
                        // going over opposite
                        knot[r][c].splice(0, 0, node);
                        pass = 'o';
                    }
                }
                pattern.push(pass);
            }
        }
        side = next.side;
        bight = next.bight;
        tooth = next.tooth;
        steps[i+1] = {
            segment: segId,
            tooth: tooth + 1,
            bight: bight + 1,
            side: tob(side),
            pass1,
            pattern: pattern.join(',')
        };
        if (pattern.length < 1) {
            delete steps[i+1].pattern;
        }
        if (img) {
            console.log(`------step ${i+1}------`);
            console.table({
                from: {
                    segment: segId,
                    tooth: steps[i].tooth,
                    bight: steps[i].bight,
                    side: steps[i].side
                },
                to: {
                    segment: segId,
                    tooth: steps[i+1].tooth,
                    bight: steps[i+1].bight,
                    side: steps[i+1].side,
                    pattern: steps[i+1].pattern ? steps[i+1].pattern : ''
                }
            });
            printKnot(knot);
        }
    }
    console.table(steps);
    printKnot(knot);
}

function hasCommonDenominator(a, b) {
    // Find the absolute values of a and b
    let num1 = Math.abs(a);
    let num2 = Math.abs(b);

    // Find the greatest common divisor (GCD) using Euclidean algorithm
    while (num2 !== 0) {
        let temp = num2;
        num2 = num1 % num2;
        num1 = temp;
    }

    // Check if the GCD is greater than 1
    return num1 > 1;
}

function oou(bightsAway, side) {
    console.log({ bightsAway });
    const isOdd = bightsAway % 2;
    if (isOdd === 1) {
        // odd bights away
        if (offset === 2) {
            return side ? 'u' : 'o';
        }
        return side ? 'o' : 'u';
    } else {
        // even bights away
        if (offset === 2) {
            return side ? 'o' : 'u';
        }
        return side ? 'u' : 'o';
    }
}

function getSeg(step) {
    let s = [];
    let loops = 0;
    while (step >= 0) {
        if (step >= letters.length) {
            s.push(letters[loops]);
            loops++;
            step -= letters.length;
        } else {
            s.push(letters[step]);
            step -= letters.length;
        }
    }
    return s.join('');
}

function printKnot(knot) {
    knot = JSON.parse(JSON.stringify(knot));
    const brow = (w) => {
        let row = [];
        let bight = 1;
        for (let i = 0; i < w; i++) {
            if (i % Math.round(w / bights) === 0) {
                row.push(bight++);
            } else {
                row.push(0);
            }
        }
        return row;
    };
    const trow = (w, isOdd = false) => {
        const offset = isOdd ? 1 : 0;
        let row = [];
        let other = isOdd;
        let tooth = 1 + Math.round(offset * tstep / 2);
        for (let i = 0; i < w; i++) {
            if (i % Math.round((w / bights / (1 + offset))) === 0 && !other) {
                row.push(Math.round(tooth));
                tooth += tstep;
                if (isOdd) {
                    other = !other;
                }
            } else {
                row.push(0);
                if (isOdd) {
                    other = !other;
                }
            }
        }
        return row;
    };
    const w = knot[0].length;
    knot.push(trow(w, leads % 2 === 1));
    knot.push(brow(w));
    knot.splice(0, 0, trow(w));
    knot.splice(0, 0, brow(w));
    knot.forEach((r, i) => {
        if (i <= 1 || i >= knot.length - 2) {
            process.stdout.write(`${i === 0 || i === knot.length - 1 ? 'b:|' : 't:|'}`);
        } else {
            process.stdout.write('  |');
        }
        r.forEach(c => {
            let s = String(c);
            if (typeof c === 'object') {
                s = String(c[0].segId);
            }
            let txt;
            if (s === '0') {
                txt = '   ';
            } else if (s.length === 1) {
                txt = ` ${s} `;
            } else {
                txt = `${s} `;
            }
            process.stdout.write(txt);
        });
        process.stdout.write('|');
        console.log();
    });
}

function getSeg(step) {
    let s = [];
    let loops = 0;
    while (step >= 0) {
        if (step >= letters.length) {
            s.push(letters[loops]);
            loops++;
            step -= letters.length;
        } else {
            s.push(letters[step]);
            step -= letters.length;
        }
    }
    return s.join('');
}

function getArg(tag) {
    const i = process.argv.indexOf(tag);
    return process.argv[i+1];
}

function hasFlag(flag) {   
    const i = process.argv.indexOf(flag);
    if (i !== -1) {
        return true;
    } else {
        return false;
    }
}
/* potential term output
...........................
t:| 7 || 9 || 1 || 3 || 5 |
b:  3    2    1    5    4  
   g f  i h  a j  c b  e d 
  u   \u   \/   \/   \u   \
  \   /\   /o   /o   /\   /
   \ o  \ /  \ /  \ /  \ o
    \    /    /    /    \
   / \  / u  / u  / u  / \
  u   \/   \/   \/   \/   \
  \   /o   /o   /o   /o   /
   b a  d c  f e  h g  j i
b:  3    2    1    5    4
t:| 7 || 9 || 1 || 3 || 5 |
*/
