import { Text } from "components/Text";
import { ChevronLeft } from "lucide-react";

export function AppHeader({
    header,
    rightHeader,
    showBack,
    onBackClick,
    headerType,
}) {
    return (
        <div
            className={`flex ${
                rightHeader || showBack ? "justify-between items-center" : ""
            } mx-[10px] md:mx-[30px] xl:mx-[50px] my-[20px]`}>
            {showBack && (
                <ChevronLeft
                    size={25}
                    onClick={onBackClick}
                    className='mr-[20px] cursor-pointer'
                />
            )}
            <Text
                className='text-left flex-1'
                type={headerType ?? "semiBold-header"}>
                {header}
            </Text>
            {rightHeader && rightHeader}
        </div>
    );
}
