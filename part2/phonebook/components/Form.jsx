const Form = ({onSubmit, onChange_name, value_name, onChange_number, value_number}) => {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    name: <input value={value_name} onChange={onChange_name} /> 
                </div>
                <div>
                    number: <input value={value_number} onChange={onChange_number} />
                </div>
                <div>
                <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default Form