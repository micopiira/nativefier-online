import React from 'react';

const Alert = ({text}) => <pre style={{backgroundColor: '#df6c6c', color: 'white'}}>{text}</pre>

const Index = ({error}) => <div>
                {error && <Alert text={error.toString()}/>}
                <form action="" method="POST">
                    <label htmlFor="url">Url</label>
                    <input type="url" name="url"/>
                    <input type="submit" value="Nativeify"/>
                </form>
        </div>;

export default Index;