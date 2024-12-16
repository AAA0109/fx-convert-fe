import { ErrorListProps } from 'react-jsonschema-form';

export const ErrorListTemplate = (props: ErrorListProps) => {
  const { errors } = props;
  return (
    <ul>
      {errors.map((error) => (
        <li key={error.stack}>{error.stack}</li>
      ))}
    </ul>
  );
};
export default ErrorListTemplate;
