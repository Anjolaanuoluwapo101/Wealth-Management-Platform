
export default function CredentialCheckModal() {
    return (
        <div className="w3-modal" style={{ display: 'block' }}>
            <div className="w3-modal-content w3-card-4 w3-animate-opacity w3-center w3-padding-32">
                <h2 className="w3-text-black">Checking Credentials</h2>
                <div className="w3-margin-top">
                    <div className="w3-spinner w3-text-red" style={{ width: '50px', height: '50px' }}></div>
                </div>
                <p className="w3-text-gray">Please wait while we verify your profile details...</p>
            </div>
        </div>
    );
}