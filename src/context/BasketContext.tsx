import { createContext, useContext, useState, type ReactNode } from 'react';

export type BasketLine = {
    productId: number;
    variationId: number | null;
    quantity: number;
};

type BasketContextValue = {
    lines: BasketLine[];
    itemCount: number;
    add: (productId: number, variationId: number | null) => void;
    setQuantity: (line: BasketLine, quantity: number) => void;
};

const STORAGE_KEY = 'koolskools-basket';

const BasketContext = createContext<BasketContextValue | null>(null);

function loadLines(): BasketLine[] {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        return Array.isArray(stored) ? stored : [];
    } catch {
        // Storage can throw when cookies/site data are blocked. Start empty.
        return [];
    }
}

function saveLines(lines: BasketLine[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
        // The basket still works for this visit; it just won't be remembered
    }
}

function isSameItem(line: BasketLine, productId: number, variationId: number | null) {
    return line.productId === productId && line.variationId === variationId;
}

export function BasketProvider({ children }: { children: ReactNode }) {
    const [lines, setLines] = useState(loadLines);

    function update(next: BasketLine[]) {
        setLines(next);
        saveLines(next);
    }

    function add(productId: number, variationId: number | null) {
        const exists = lines.some((line) => isSameItem(line, productId, variationId));
        update(
            exists
                ? lines.map((line) =>
                      isSameItem(line, productId, variationId)
                          ? { ...line, quantity: line.quantity + 1 }
                          : line,
                  )
                : [...lines, { productId, variationId, quantity: 1 }],
        );
    }

    function setQuantity(target: BasketLine, quantity: number) {
        update(
            lines
                .map((line) =>
                    isSameItem(line, target.productId, target.variationId)
                        ? { ...line, quantity }
                        : line,
                )
                .filter((line) => line.quantity > 0),
        );
    }

    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

    return (
        <BasketContext.Provider value={{ lines, itemCount, add, setQuantity }}>
            {children}
        </BasketContext.Provider>
    );
}

export function useBasket() {
    const basket = useContext(BasketContext);
    if (!basket) throw new Error('useBasket must be used inside BasketProvider');
    return basket;
}
