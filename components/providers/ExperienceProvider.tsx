"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  ExperienceAction,
  ExperienceState,
  ProjectId,
  ZoneId,
  ZoneState,
} from "@/types/experience";
import { ZONES, getActiveZone, getZoneState } from "@/data/zoneConfig";

const initialZoneStates = ZONES.reduce(
  (acc, zone) => {
    acc[zone.id] = "dormant";
    return acc;
  },
  {} as Record<ZoneId, ZoneState>
);

const initialState: ExperienceState = {
  scrollProgress: 0,
  activeZone: "boot",
  zoneStates: initialZoneStates,
  bootComplete: false,
  bootLogIndex: 0,
  selectedProject: null,
  hoverNodeId: null,
  throughputMultiplier: 1,
  contactRevealed: false,
  reducedMotion: false,
};

function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction
): ExperienceState {
  switch (action.type) {
    case "SET_SCROLL_PROGRESS": {
      const activeZone = getActiveZone(action.progress).id;
      const zoneStates = ZONES.reduce(
        (acc, zone) => {
          acc[zone.id] = getZoneState(zone, action.progress);
          return acc;
        },
        {} as Record<ZoneId, ZoneState>
      );
      return {
        ...state,
        scrollProgress: action.progress,
        activeZone,
        zoneStates,
      };
    }
    case "SET_ACTIVE_ZONE":
      return { ...state, activeZone: action.zone };
    case "SET_ZONE_STATE":
      return {
        ...state,
        zoneStates: { ...state.zoneStates, [action.zone]: action.state },
      };
    case "SET_BOOT_COMPLETE":
      return { ...state, bootComplete: action.complete };
    case "SET_BOOT_LOG_INDEX":
      return { ...state, bootLogIndex: action.index };
    case "SET_SELECTED_PROJECT":
      return { ...state, selectedProject: action.project };
    case "SET_HOVER_NODE":
      return { ...state, hoverNodeId: action.nodeId };
    case "SET_THROUGHPUT":
      return { ...state, throughputMultiplier: action.multiplier };
    case "SET_CONTACT_REVEALED":
      return { ...state, contactRevealed: action.revealed };
    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.reduced };
    default:
      return state;
  }
}

interface ExperienceContextValue {
  state: ExperienceState;
  setScrollProgress: (progress: number) => void;
  setBootComplete: (complete: boolean) => void;
  setBootLogIndex: (index: number) => void;
  setSelectedProject: (project: ProjectId | null) => void;
  setHoverNode: (nodeId: string | null) => void;
  setThroughput: (multiplier: number) => void;
  setContactRevealed: (revealed: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);

  const setScrollProgress = useCallback((progress: number) => {
    dispatch({ type: "SET_SCROLL_PROGRESS", progress });
  }, []);

  const setBootComplete = useCallback((complete: boolean) => {
    dispatch({ type: "SET_BOOT_COMPLETE", complete });
  }, []);

  const setBootLogIndex = useCallback((index: number) => {
    dispatch({ type: "SET_BOOT_LOG_INDEX", index });
  }, []);

  const setSelectedProject = useCallback((project: ProjectId | null) => {
    dispatch({ type: "SET_SELECTED_PROJECT", project });
  }, []);

  const setHoverNode = useCallback((nodeId: string | null) => {
    dispatch({ type: "SET_HOVER_NODE", nodeId });
  }, []);

  const setThroughput = useCallback((multiplier: number) => {
    dispatch({ type: "SET_THROUGHPUT", multiplier });
  }, []);

  const setContactRevealed = useCallback((revealed: boolean) => {
    dispatch({ type: "SET_CONTACT_REVEALED", revealed });
  }, []);

  const setReducedMotion = useCallback((reduced: boolean) => {
    dispatch({ type: "SET_REDUCED_MOTION", reduced });
  }, []);

  const value = useMemo(
    () => ({
      state,
      setScrollProgress,
      setBootComplete,
      setBootLogIndex,
      setSelectedProject,
      setHoverNode,
      setThroughput,
      setContactRevealed,
      setReducedMotion,
    }),
    [
      state,
      setScrollProgress,
      setBootComplete,
      setBootLogIndex,
      setSelectedProject,
      setHoverNode,
      setThroughput,
      setContactRevealed,
      setReducedMotion,
    ]
  );

  return (
    <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
  );
}

export function useExperienceContext(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperienceContext must be used within ExperienceProvider");
  }
  return context;
}
