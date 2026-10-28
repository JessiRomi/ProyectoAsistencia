
import { useCallback, useRef, useState } from "react";

export function useQrScanner() {
    const [value, setValue] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(true);
    const scanLock = useRef(false);

    const onScanned = useCallback((data: string) => {
        if (scanLock.current || !data.trim()) {
            return;
        }

        scanLock.current = true;
        setValue(data);
        setEnabled(false);
    }, []);

    const reset = useCallback(() => {
        scanLock.current = false;
        setValue(null);
        setEnabled(true);
    }, []);

    return {
        value,
        enabled,
        onScanned,
        reset,
    };
}
