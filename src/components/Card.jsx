export function Card({ children }) {
    return <div className=''>{children}</div>;
}
export function CardHeader({ children }) {
    return <div className=''>{children}</div>;
}
export function CardTitle({ children }) {
    return <h2 className=''>{children}</h2>;
}
export function CardContent({ children, className }) {
    return <div className={className}> {children}</div>;
}
