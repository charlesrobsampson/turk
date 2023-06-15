// const bights = 13;
// const leads = 6;
// const teeth = 43;

const args = process.argv;
const leads = Number(args[2]);
const bights = Number(args[3]);
let teeth = Number(args[4]);
const letters = 'abcdefghijklmnopqrstuvwxyz';
const oddLeads = leads % 2 === 1;
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
    const tstep = t / b;
    const bstep = l / 2;
    const tob = (side) => {
        return side ? 'top' : 'bottom';
    };
    let side = true;
    let steps = {};
    let bight = 1;
    let tooth = 1;
    let rot = 0;
    let segs = {
        [tooth]: {
            [+side]: {
                0: {
                    segment: getSeg(0),
                    bight
                }
            }
        }
    };

    let s = tob(side);
    steps[0] = {
        tooth,
        bight,
        side: s
    };
    side = !side;
    console.log(steps[0]);
    for (let i = 0; i < b * 2; i++) {
        let around = false;
        let last = tooth;
        let pass1 = 0;
        bight += l / 2;
        tooth -= tstep * bstep;
        while (tooth < 1) {
            tooth += t;
        }
        while (bight > b) {
            bight -= b;
            rot++;
            pass1++;
            around = true;
        }
        s = tob(side);
        if (segs[tooth]) {
            segs[tooth][+side] = {
                0: {
                    segment: i+1 == b*2 ? getSeg(0) : getSeg(i + 1),
                    bight
                },
                1: {
                    segment: getSeg(i),
                    bight
                }
            };
        } else {
            segs[tooth] = {
                [+side]: {
                    0: {
                        segment: getSeg(i + 1),
                        bight
                    },
                    1: {
                        segment: getSeg(i),
                        bight
                    }
                }
            };
        }
        let pattern = [];
        let pattern2 = [];
        let topHalf = [];
        let bottomHalf = [];
        let weave = side;
        // loop through each tooth step to check if there's a bight on either side
        for (j = 1; j <= bstep; j++) {
            let eval = Math.round(last - (j * tstep));
            while (eval < 1) {
                eval += t;
            }
            console.log(`checking ${eval}`);
            const nodes = segs[eval];// this means there are segments on this tooth
            if (nodes) {
                // segments on the same side as the destination
                const sameSide = nodes[+side];
                // segments on the other side from the destination
                const diffSide = nodes[+!side];
                if (sameSide && eval !== tooth) {
                    // check for crossings on teeth on the same side as destination that are not the destination
                    const dir = sameSide[0];
                    if (dir) {
                        console.log({
                            sameSide
                        });
                        console.log(`going to side ${+side} tooth ${tooth} with ${getSeg(i)} go ${oou(j, side)}`, dir);
                        // bottomHalf.push(oou(j, side));
                        bottomHalf.splice(0, 0, oou(j, side));
                        // add same side crosses to beginning of bottom half
                    }
                }
                if (diffSide) {
                    // check for crossings from teeth on the other side from destination
                    const dir = diffSide[1];
                    if (dir) {
                        console.log({
                            diffSide
                        });
                        console.log(`going to side ${+side} tooth ${tooth} with ${getSeg(i)} go ${oou(j, side)}`, dir);
                        // topHalf.splice(0, 0, oou(j, side));
                        topHalf.push(oou(j, side));
                        // add other side crosses to end of top half
                    }
                }
            }
        }
        for (j = 0; j < rot; j++) {
            pattern.push(weave ? 'u' : 'o');
            weave = !weave;
        }
        pattern2 = [...topHalf, ...bottomHalf];
        let reportTooth = Math.round(tooth);
        let reportBight = bight;
        if (oddLeads && !side) {
            reportTooth -= (tstep * bstep) / 2;
            while (reportTooth < 1) {
                reportTooth += teeth;
            }
            reportBight += .5;
            while (reportBight > bights) {
                reportBight -= bights;
            }
        }
        steps[i + 1] = {
            pass1,
            tooth: reportTooth,
            bight: reportBight,
            side: s,
            pattern: pattern.join(','),
            pattern2: pattern2.join(',')
        };
        console.log('step:', i+1);
        console.log(steps[i+1]);
        side = !side;
    }
    console.log(steps);
    console.dir(segs, { depth: null });
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

function oou(j, side) {
    console.log({ j });
    const isOdd = j % 2;
    if (isOdd === 1) {
        // odd bights away
        return side ? 'o' : 'u';
    } else {
        // even bights away
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