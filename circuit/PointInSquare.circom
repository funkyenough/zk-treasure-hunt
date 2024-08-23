pragma circom 2.0.0

include "./node_modules/circomlib/circuits/comparators.circom";

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

    signal output isInside;

    signal input forum[2][2];
    signal input point[2];

    component lt1 = LessThan(32);
    lt1.in[0] <== pointLat;
    lt1.in[1] <== northBound;
    lt1.out === 1;

    component lt1 = GreaterThan(32);
    gt1.in[0] <== pointLat;
    gt1.in[1] <== southBound;
    gt1.out === 1;

    component lt2 = LessThan(32);
    lt2.in[0] <== pointLon;
    lt2.in[1] <== eastBound;
    lt2.out === 1;

    component lt1 = GreaterThan(32);
    gt2.in[0] <== pointLon;
    gt2.in[1] <== westBound;
    gt2.out === 1;

    out <-- (gt1.out + gt2.out + lt1.out + lt2.out) * 1/4;
    out === 1;
};

component main = Prove();