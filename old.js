// const bights = 13;
// const leads = 6;
// const teeth = 43;

const args = process.argv;
const leads = Number(args[2]);
const bights = Number(args[3]);
const teeth = Number(args[4]);

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
    let side = true;
    let steps = {};
    let bight = 1;
    let tooth = 1;
    let rot = 0;
    steps[0] = {
        tooth,
        bight,
        side: side ? 'top' : 'bottom'
    };
    side = !side;
    for (let i = 0; i < b * 2; i++) {
        let wrap = 0;
        bight += l / 2;
        tooth -= tstep * bstep;
        while (tooth < 1) {
            tooth += t;
        }
        while (bight > b) {
            bight -= b;
            rot++;
            wrap++;
        }
        let pattern = [];
        let weave = side;
        for (j = 0; j < rot; j++) {
            pattern.push(weave ? 'u' : 'o');
            weave = !weave;
        }
        steps[i+1] = {
            wrap,
            tooth: Math.round(tooth),
            bight,
            side: side ? 'top' : 'bottom',
            pattern: pattern.join(',')
        };
       side = !side;
    }
    console.log(steps);
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
  
