const snarkjs = require("snarkjs");
const fs = require("fs");
const crypto = require("crypto");

class PlonkProver {
    constructor(circuitName) {
        this.circuitName = circuitName;
        this.circomPath = `${circuitName}.circom`;
        this.circuitWasmPath = `${circuitName}_js/${circuitName}.wasm`;
        this.circuitR1csPath = `${circuitName}.r1cs`;
        this.circuitSymbolsPath = `${circuitName}.sym`;
        this.ptauPath = "pot15_final.ptau";
        this.circuitZkeyPath = `${circuitName}.zkey`;
        this.verificationKeyPath = `${circuitName}_verification_key.json`;
    }

    async prepareCircuit() {
        console.log("Preparing circuit...");

        // Step 1: Compile the circuit
        if (!fs.existsSync(this.circuitWasmPath)) {
            console.log("Compiling circuit...");
            await snarkjs.wtns.compile(this.circomPath, this.circuitWasmPath);
        }

        // Step 2: Generate the R1CS constraint system
        if (!fs.existsSync(this.circuitR1csPath)) {
            console.log("Generating R1CS...");
            await snarkjs.r1cs.info(this.circuitR1csPath);
        }

        // Step 3: Generate the trusted setup (if not already done)
        if (!fs.existsSync(this.ptauPath)) {
            console.log("Generating trusted setup...");
            await this.generatePowersOfTau();
        }

        // Step 4: Generate the zkey
        if (!fs.existsSync(this.circuitZkeyPath)) {
            console.log("Generating zkey...");
            await snarkjs.plonk.setup(this.circuitR1csPath, this.ptauPath, this.circuitZkeyPath);
        }

        // Step 5: Export the verification key
        if (!fs.existsSync(this.verificationKeyPath)) {
            console.log("Exporting verification key...");
            const vKey = await snarkjs.zKey.exportVerificationKey(this.circuitZkeyPath);
            fs.writeFileSync(this.verificationKeyPath, JSON.stringify(vKey, null, 2));
        }

        console.log("Circuit preparation complete.");
    }

    async generatePowersOfTau() {
        const ptau0 = "pot15_0.ptau";
        const ptau1 = "pot15_1.ptau";
        const ptauBeacon = "pot15_beacon.ptau";
        const curve = "bn128";
        const power = 15;

        // Step 1: Start a new ceremony
        await snarkjs.powersOfTau.newAccumulator(curve, power, ptau0);

        // Step 2: Contribute to the ceremony
        const entropy = crypto.randomBytes(32);
        await snarkjs.powersOfTau.contribute(ptau0, ptau1, "Contribution 1", entropy);

        // Step 3: Apply a beacon
        const beaconHash = crypto.randomBytes(32).toString('hex');
        await snarkjs.powersOfTau.beacon(ptau1, ptauBeacon, "Beacon contribution", beaconHash, 10);

        // Step 4: Prepare for phase 2
        await snarkjs.powersOfTau.preparePhase2(ptauBeacon, this.ptauPath);

        // Cleanup intermediate files
        fs.unlinkSync(ptau0);
        fs.unlinkSync(ptau1);
        fs.unlinkSync(ptauBeacon);
    }

    async generateWitness(input) {
        console.log("Generating witness...");
        const { witness } = await snarkjs.wtns.calculate(input, this.circuitWasmPath, this.circuitSymbolsPath);
        return witness;
    }

    async generateProof(witness) {
        console.log("Generating proof...");
        const { proof, publicSignals } = await snarkjs.plonk.prove(this.circuitZkeyPath, witness);
        return { proof, publicSignals };
    }

    async verifyProof(proof, publicSignals) {
        console.log("Verifying proof...");
        const vKey = JSON.parse(fs.readFileSync(this.verificationKeyPath));
        return await snarkjs.plonk.verify(vKey, publicSignals, proof);
    }
}

// Example usage
async function main() {
    const prover = new PlonkProver("isCloser");

    try {
        // Prepare the circuit (this only needs to be done once)
        await prover.prepareCircuit();

        // Example input
        const input = {
            treasureCoord: ["12345", "12345"],
            userPrevCoord: ["12343", "12343"],
            userCurrCoord: ["12344", "12344"],
            maxCoord: "65536"
        };

        // Generate witness
        const witness = await prover.generateWitness(input);

        // Generate proof
        const { proof, publicSignals } = await prover.generateProof(witness);

        // Verify proof
        const isValid = await prover.verifyProof(proof, publicSignals);
        console.log("Proof is valid:", isValid);
    } catch (error) {
        console.error("Error:", error);
    }
}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
});

module.exports = PlonkProver;