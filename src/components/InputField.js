export default function InputField({ type, name, placeholder, onChange }) {
    return <input type={type} name={name} placeholder={placeholder} onChange={onChange} required />;
  }
  