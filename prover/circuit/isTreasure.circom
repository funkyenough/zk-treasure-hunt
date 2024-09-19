pragma circom 2.0.0;

// TODO Add Range Check

include "../node_modules/circomlib/circuits/comparators.circom";

template isTreasure() {
    signal input treasureCoord[2];
    signal input userCoord[2];

    signal xDiffSquared;
    signal yDiffSquared;
    signal dist;

    signal output isTreasure;

    component iz = IsZero();

    xDiffSquared <== (treasureCoord[0] - userCoord[0]) * (treasureCoord[0] - userCoord[0]);
    yDiffSquared <== (treasureCoord[1] - userCoord[1]) * (treasureCoord[1] - userCoord[1]);
    dist <== xDiffSquared + yDiffSquared;

    iz.in <== dist;
    isTreasure <== iz.out;
}

component main {public [userCoord]} = isTreasure();

/* INPUT = {
    "treasureCoord": ["12345", "12345"],
    "userCoord": ["12345", "12345"]
}*/

/* INPUT = {
    "treasureCoord": ["12345", "12345"],
    "userCoord": ["12345", "12344"]
}*/