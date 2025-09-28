"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Product } from "@/types";

interface ComparisonState {
  selectedProducts: Product[];
  comparisonMode: "browse" | "compare";
  maxProducts: number;
}

type ComparisonAction =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "REMOVE_PRODUCT"; payload: string }
  | { type: "CLEAR_COMPARISON" }
  | { type: "SET_MODE"; payload: "browse" | "compare" };

interface ComparisonContextType {
  state: ComparisonState;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearComparison: () => void;
  setMode: (mode: "browse" | "compare") => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
}

const initialState: ComparisonState = {
  selectedProducts: [],
  comparisonMode: "browse",
  maxProducts: 3,
};

function comparisonReducer(
  state: ComparisonState,
  action: ComparisonAction
): ComparisonState {
  switch (action.type) {
    case "ADD_PRODUCT":
      if (state.selectedProducts.length >= state.maxProducts) {
        return state;
      }
      if (state.selectedProducts.some((p) => p.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, action.payload],
      };

    case "REMOVE_PRODUCT":
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(
          (p) => p.id !== action.payload
        ),
      };

    case "CLEAR_COMPARISON":
      return {
        ...state,
        selectedProducts: [],
        comparisonMode: "browse",
      };

    case "SET_MODE":
      return {
        ...state,
        comparisonMode: action.payload,
      };

    default:
      return state;
  }
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  const addProduct = (product: Product) => {
    dispatch({ type: "ADD_PRODUCT", payload: product });
  };

  const removeProduct = (productId: string) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: productId });
  };

  const clearComparison = () => {
    dispatch({ type: "CLEAR_COMPARISON" });
  };

  const setMode = (mode: "browse" | "compare") => {
    dispatch({ type: "SET_MODE", payload: mode });
  };

  const isInComparison = (productId: string) => {
    return state.selectedProducts.some((p) => p.id === productId);
  };

  const canAddMore = state.selectedProducts.length < state.maxProducts;

  const value: ComparisonContextType = {
    state,
    addProduct,
    removeProduct,
    clearComparison,
    setMode,
    isInComparison,
    canAddMore,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
