// const bights = 13;
// const leads = 6;
// const teeth = 43;

const args = process.argv;
const leads = Number(args[2]);
const bights = Number(args[3]);
const teeth = Number(args[4]);
const letters = 'abcdefghijklmnopqrstuvwxyz';
const offset = 1 + (leads % 2);

if (args.length != 5) {
    console.log(`missing required parameters
    usage:
    node index.js <leads> <bights> <teeth>
    `);
} else {
    console.log(`steps to create turks head with
    ${bights} bights
    ${leads} leads
    on a jig with ${teeth} teeth
    `);
    getSteps(bights, leads, teeth);
}

function getSteps(b, l, t) {
    if (hasCommonDenominator(b, l)) {
        console.log(`can't make turks head with ${b} bights and ${l} leads`);
        return;
    }
    const tstep = t / b;// number of teeth between bights
    const bstep = l / 2;// number of bights to skip
    const tob = (side) => {
        return side ? 'top' : 'bottom';
    };
    let side = true;
    let steps = {};
    let bight = 1;
    let tooth = 1;
    let rot = 0;
    const h = (l * tstep) - 1;
    const w = t * 2;
    let knot = (() => {
        const brow = () => {
            let row = [];
            let bight = 1;
            for (let i = 0; i < w; i++) {
                if (i % Math.round(t / b) === 0) {
                    row.push(bight++);
                } else {
                    row.push(0);
                }
            }
            return row;
        };
        const trow = () => {
            let row = [];
            let tooth = 1;
            for (let i = 0; i < w; i++) {
                if (i % 2 === 0) {
                    row.push(tooth++);
                } else {
                    row.push(0);
                }
            }
            return row;
        };
        let out = [];
        out.push(trow());
        for (let r = 0; r < h; r++) {
            let row = [];
            for (let c = 0; c < w; c++) {
                row.push(0);
            }
            out.push(row);
        }
        out.push(trow());
        return out;
    })();
    console.log(knot);
    // for (let i = 0; i < 5; i++) {
    for (let i = 0; i < b * 2; i++) {
        let pattern = [];
        let pass1 = 0;
        let next = {
            bight,
            tooth,
            side: !side
        };
        next.bight += l / 2;
        next.tooth -= Math.round(tstep * bstep);
        while (next.tooth < 1) {
            next.tooth += t;
        }
        while (next.bight > b) {
            next.bight -= b;
            pass1++;
        }
        const segId = getSeg(i);
        for (let j = 0; j < h; j++) {
            let c = Math.round((tooth * 2) - (j+3));
            while (c < 0) {
                c += t*2;
            }
            const r = Math.round((h+2)*(+!side)+(j+1)*(side ? 1 : -1));
            const cross = knot[r][c];
            const node = {
                segId,
                from: {
                    tooth,
                    bight,
                    side
                },
                to: {
                    tooth: next.tooth,
                    bight: next.bight,
                    side: next.side
                }
            };
            if (cross === 0) {
                knot[r][c] = [node];
            } else {
                console.dir({
                    evaluate: {
                        cross,
                        vs: node
                    }
                }, { depth: null });
                // if going from top to bottom
                // go under opposite and over same
                // if going from bottom to top
                // go over opposite and under same
                const isBig = cross[0].from.bight < node.from.bight;
                const isSame = cross[0].from.bight % 2 === (node.from.bight + +isBig) % 2
                let pass;
                if (node.from.side) {
                    // from the top
                    if (isSame) {
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
                    if (isSame) {
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
    }
    console.dir(knot, { depth: null });
    printKnot(knot);
}
// getSteps(bights, leads, teeth);

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
    const brow = (w) => {
        let row = [];
        let bight = 1;
        for (let i = 0; i < w; i++) {
            if (i % Math.round(w / bights) === 0) {
                row.push(bight);
                bight--;
                while (bight < 1) {
                    bight += bights;
                }
            } else {
                row.push(0);
            }
        }
        return row;
    };
    knot.push(brow(knot[0].length));
    knot.splice(0, 0, brow(knot[0].length));
    knot.forEach((r, i) => {
        if (i <= 1 || i >= knot.length-2) {
            process.stdout.write(`${i === 0 || i === knot.length - 1 ? 'b:|' : 't:|'}`);
        } else {
            process.stdout.write('  |');
        }
        r.forEach(c => {
            let s = String(c);
            if (typeof c === 'object') {
                s = String(c[0].segId);
            }
            // console.log({c});
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