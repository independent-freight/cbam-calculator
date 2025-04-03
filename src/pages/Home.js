import { CBAMCalculator } from "cbam-calculator";
import { useSelector } from "react-redux";
import { AppHeader } from "layout/AppHeader";

export function Home() {
    const user = useSelector((state) => state.user);

    return (
        <div>
            <AppHeader header={`Welcome ${user?.full_name ?? ""},`} />
            <CBAMCalculator />
        </div>
    );
}
