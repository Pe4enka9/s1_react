export default function PageLoader({isElement = false}) {
    return (
        <div className={`page-loader ${isElement ? 'element' : ''}`}>
            <div className="page-loader-item"></div>
        </div>
    )
}