import { Dictionary } from "./dictionary";

const dlc = new Dictionary<string, number>();

dlc.set("a", 1);
dlc.set("b", 2);
dlc.set("c", 4);
dlc.set("a", 100);

dlc.print();
console.log(dlc.size);
console.log(dlc.has("b"))
console.log(dlc.has("d"))

dlc.delete("a");

dlc.print()
console.log(dlc.size);