export function Text({ type = "", children, className, onClick }) {
    const getTypeStyle = () => {
        const types = type.split("-");
        let style = "";
        types.forEach((element) => {
            switch (element) {
                case "label":
                    style += " text-sm";
                    break;
                case "body":
                    style += " text-base";
                    break;
                case "subHeader":
                    style += " text-xl";
                    break;
                case "header":
                    style += " text-3xl";
                    break;
                case "bold":
                    style += " font-bold";
                    break;
                case "semiBold":
                    style += " font-semibold";
                    break;
                case "link":
                    style += " text-blue-500";
                    break;
                case "error":
                    style += " text-red-500";
                    break;
                case "faded":
                    style += " text-gray-400";
                    break;
                default:
                    return;
            }
        });
        return style;
    };
    return (
        <div
            onClick={onClick}
            className={`${className ?? ""} ${getTypeStyle()} ${
                onClick ? "cursor-pointer" : ""
            }`}>
            {children}
        </div>
    );
}
