This product is developped for ETH Tokyo 2024 Hackthon ( https://www.ethtokyo.com/ ).

The huckathon details are found at
https://app.akindo.io/hackathons/3dXM7ZO2WsxvlkXp .

What it does

- We build a multi-play treasure hunt game, which is based on ZKP technology, as the project name says.
  Prover sets a hidden treasure spot secretly, and users moves around on the map to find the spot.
  Each user provides information about the move (source and destination positions), then Prover generates a ZK proof which shows if the move is towards the hidden spot (or apart from the spot),
  and publishes the proof onto a blockchain.
  (with this step, users are able to identify whether the move is towards a right direction to the treasure spot, while the spot location is not exposed)
  A user decides on his/her next move, based on the published the proofs. Upon a preset time comes, a nearly user will be awarded.

The problem it solves

- Our problem is that how we can share a user's location is closer to the treasure spot location without exposing the spot location itself.

Challenges I ran into

- We took a long time to reach to this idea, while we set our domain as a kind of location plus ZKP.

Technologies I used

- We used ZKP platform.

How we built it

- We divided our activities into two pieces, such as frontend and backend; the frontend team works mainly on map UI, the backend team works on ZK circuit and related libraries and contracts.
