import { createContext } from "react";
import { ICompanionAdContext } from "../../types/CompanionAds";

const CompanionAdContext = createContext<ICompanionAdContext | undefined>(undefined);

export default CompanionAdContext;