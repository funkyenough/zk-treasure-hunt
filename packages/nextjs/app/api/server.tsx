import { useScaffoldWatchContractEvent } from "../../hooks/scaffold-eth";

function Server() {
  useScaffoldWatchContractEvent({
    contractName: "zkTreasure",
    eventName: "CoordinateCreated",

    onLogs: logs => {
      logs.map(log => {
        const { coordinateId, player, x, y } = log.args;
        console.log("📡 CoordinateCreated event:", coordinateId, player, x, y);
      });
      // execute verification
    },
  });
}

export default Server;
