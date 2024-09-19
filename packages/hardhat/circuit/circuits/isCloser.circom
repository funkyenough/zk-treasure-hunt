pragma circom 2.0.0;

// TODO Add Range Check

include "../node_modules/circomlib/circuits/comparators.circom";

template isCloser() {
    signal input treasureCoord[2];
    signal input userPrevCoord[2];
    signal input userCurrCoord[2];

    signal prevXDiffSquared;
    signal prevYDiffSquared;
    signal prevDist;

    signal currXDiffSquared;
    signal currYDiffSquared;
    signal currDist;

    signal output isCloser;

    component lt = LessThan(64);

    prevXDiffSquared <== (treasureCoord[0] - userPrevCoord[0]) * (treasureCoord[0] - userPrevCoord[0]);
    prevYDiffSquared <== (treasureCoord[1] - userPrevCoord[1]) * (treasureCoord[1] - userPrevCoord[1]);
    prevDist <== prevXDiffSquared + prevYDiffSquared;

    currXDiffSquared <== (treasureCoord[0] - userCurrCoord[0]) * (treasureCoord[0] - userCurrCoord[0]);
    currYDiffSquared <== (treasureCoord[1] - userCurrCoord[1]) * (treasureCoord[1] - userCurrCoord[1]);
    currDist <== currXDiffSquared + currYDiffSquared;

    lt.in[0] <== currDist;
    lt.in[1] <== prevDist;
    isCloser <== lt.out;
}

// component main {public [userPrevCoord, userCurrCoord]} = isCloser();

/* INPUT = {
    "treasureCoord": ["12345", "12345"],
    "userPrevCoord": ["12343", "12343"],
    "userCurrCoord": ["12344", "123444"]
}*/