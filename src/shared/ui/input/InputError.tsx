type Props = {
    error?: string
};
  
export const InputError = ({ error }: Props) => {
    if(!error) return null

    return (
        <div className="text-red-500 text-sm">
            <div>{ error }</div>
        </div>
    )
}
  