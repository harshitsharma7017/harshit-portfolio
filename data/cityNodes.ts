import type { CityNode } from "@/types/experience";

export const CITY_NODES: CityNode[] = [
  {
    id: "shop-1",
    label: "Shops",
    type: "shop",
    position: [-3, 0, 0],
    connections: ["driver-1", "user-1"],
  },
  {
    id: "hospital-1",
    label: "Hospitals",
    type: "hospital",
    position: [3, 0, -1],
    connections: ["driver-2", "service-1"],
  },
  {
    id: "driver-1",
    label: "Drivers",
    type: "driver",
    position: [-1, 0.5, 2],
    connections: ["shop-1", "user-1"],
  },
  {
    id: "driver-2",
    label: "Drivers",
    type: "driver",
    position: [1, 0.5, 2],
    connections: ["hospital-1", "service-1"],
  },
  {
    id: "user-1",
    label: "Users",
    type: "user",
    position: [-2, 1, -2],
    connections: ["shop-1", "driver-1", "service-1"],
  },
  {
    id: "service-1",
    label: "Services",
    type: "service",
    position: [0, 1.5, -3],
    connections: ["hospital-1", "driver-2", "user-1"],
  },
];
