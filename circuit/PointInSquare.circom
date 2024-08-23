pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/**
* Point should be transformed to integer to prevent floating point calculations that
* can be very expensive.
* forum[0] and forum[1] are the x and y coordinates of the center of the circle.
* Element of the point should be 
*/
template Prove() {
    signal input pointLat;
    signal input pointLon;
    signal input northBound;
    signal input southBound;
    signal input eastBound;
    signal input westBound;

    signal lt;
    signal gt;
    signal output isInside;

    component lte1 = LessEqThan(32);
    lte1.in[0] <== pointLat;
    lte1.in[1] <== northBound;
    lte1.out === 1;

    component gte1 = GreaterEqThan(32);
    gte1.in[0] <== pointLat;
    gte1.in[1] <== southBound;
    gte1.out === 1;

    component lte2 = LessEqThan(32);
    lte2.in[0] <== pointLon;
    lte2.in[1] <== eastBound;
    lte2.out === 1;

    component gte2 = GreaterEqThan(32);
    gte2.in[0] <== pointLon;
    gte2.in[1] <== westBound;
    gte2.out === 1;


    lt <== lte1.out * lte2.out;
    gt <== gte1.out * gte2.out;
    isInside <== lt * gt;
}

component main = Prove();