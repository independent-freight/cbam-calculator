export function Card({ className, children, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`${className} max-w-sm mx-auto bg-white shadow-lg rounded-2xl p-6`}>
            {children}
        </div>
    );
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
