import { TimeCategory } from "./time";
import { EventCategory } from "./event";
import { ObservationCategory } from "./observation";
import { ControlCategory } from "./control";
import { ListCategory } from "./list";
import { MathCategory } from "./math";
import { VariablesCategory } from "./variables";
import { ProcedureCategory } from "./procedure";
import { LogicCategory } from "./logic";
import { TextCategory } from "./text";
import { GeometryCategory } from "./geometry";

export const BLOCK_CONFIGS = [
  ObservationCategory,
  TimeCategory,
  GeometryCategory,
  ControlCategory,
  LogicCategory,
  MathCategory,
  EventCategory,
  TextCategory,
  ListCategory,
  VariablesCategory,
  ProcedureCategory,
]