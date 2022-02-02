import Head from "next/head";

const ScriptLoader = ({ module }) => {
    const { fields } = module;
    
    return (
        <section className="section">
            <Head>
                {fields.jquery && (
                    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
                )}
            </Head>
            <div className="container">
                <div dangerouslySetInnerHTML={{ __html: fields.html }} />
            </div>
        </section>
    );
}

export default ScriptLoader;
