const ScriptLoader = ({ module }) => {
    const { fields } = module;
    return (
        <section className="section">
            <div className="container">
                <div dangerouslySetInnerHTML={{ __html: fields.html }} />
            </div>
        </section>
    );
}

export default ScriptLoader;
