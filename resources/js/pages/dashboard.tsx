import { Head } from '@inertiajs/react';
import W3Layout from '@/layouts/w3-layout';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import CredentialCheckModal from '@/components/CredentialCheckModal';
import {type SharedData } from '@/types';
import axios from 'axios';


export default function Dashboard() {

    const dummyReports = [
        { name: 'Capital Gain Report', link: '#' },
        { name: 'Detailed Report', link: '#' },
    ];

    interface MutualFund {
        id?: number;
        name: string;
        type: string;
        value: number;
        transactions: string;
    }

    interface OtherAsset {
        id?: number;
        type: string;
        value: number;
    }

    interface fixedIncome {
        id?: number;
        type: string;
        value: number;
    }

    interface insurance {
        id?: number;
        type: string,
        policy_number : number,
        expiry_date : string
    }

    const [activeTab, setActiveTab] = useState('portfolio');
    const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
    const [otherAssets, setOtherAssets] = useState<OtherAsset[]>([]);
    const [fixedIncomes, setFixedIncomes] = useState<fixedIncome[]>([]);
    const [insurances, setInsurances] = useState<insurance[]>([]);

    const { auth } = usePage<SharedData>().props;
    const [showModal, setShowModal] = useState(true);


    //Confirm if the user has completed their credentials
    useEffect(() => {
        const { pan_card, kyc_verified, address_proof, bank_proof, self_photograph } = auth.user;
        console.log(auth.user);
        if (pan_card == null || kyc_verified == null || address_proof  == null || bank_proof == null || self_photograph ==  null) {
            window.location.href = route('profile.edit');

        } else {
            setShowModal(false);
        }
    }, [auth.user]);
    
    //Load existing values
    useEffect(() => {
        axios.get('/dashboard/data')
            .then((response) => {
                setMutualFunds(response.data.mutualFunds);
                setOtherAssets(response.data.otherAssets);
                setFixedIncomes(response.data.fixedIncomes);
                setInsurances(response.data.insurances);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
            });
    }, []);

    //Save Additions Or Editing
    const saveData = () => {
        // Validation functions
        const validateMutualFund = (fund: any): boolean => {
            return typeof fund.name === 'string' &&
                typeof fund.type === 'string' &&
                typeof fund.value === 'number' &&
                typeof fund.transactions === 'string';
        };

        const validateOtherAsset = (asset: any): boolean => {
            return typeof asset.type === 'string' &&
                typeof asset.value === 'number';
        };

        const validateFixedIncome = (income: any): boolean => {
            return typeof income.type === 'string' &&
                typeof income.value === 'number';
        };

        const validateInsurance = (insurance: any): boolean => {
            return typeof insurance.type === 'string' &&
                typeof insurance.policy_number === 'number' &&
                typeof insurance.expiry_date === 'string';
        };

        // Validate all entries
        for (const fund of mutualFunds) {
            if (!validateMutualFund(fund)) {
                alert('Invalid data in Mutual Funds. Please check all entries.');
                return;
            }
        }

        for (const asset of otherAssets) {
            if (!validateOtherAsset(asset)) {
                alert('Invalid data in Other Assets. Please check all entries.');
                return;
            }
        }

        for (const income of fixedIncomes) {
            if (!validateFixedIncome(income)) {
                alert('Invalid data in Fixed Incomes. Please check all entries.');
                return;
            }
        }

        for (const insurance of insurances) {
            if (!validateInsurance(insurance)) {
                alert('Invalid data in Insurances. Please check all entries.');
                return;
            }
        }

        // Proceed with saving if all validations pass
        axios.post('/dashboard/data', {
            mutualFunds,
            otherAssets,
            fixedIncomes,
            insurances,
            // ...other data...
        }).then((response) => {
            console.log(response)
            alert('Data saved successfully');
        }).catch((error) => {
            console.log(error)
            alert('Error!');
        });
    };

    //Delete Entries
    const deleteItem = (type: string, id: number | undefined, index: number) => {
        if (!id) {
            // If the item doesn't have an ID, just remove it locally
            if (type === 'mutualFunds') setMutualFunds(mutualFunds.filter((_, i) => i !== index));
            if (type === 'otherAssets') setOtherAssets(otherAssets.filter((_, i) => i !== index));
            if (type === 'fixedIncomes') setFixedIncomes(fixedIncomes.filter((_, i) => i !== index));
            if (type === 'insurances') setInsurances(insurances.filter((_, i) => i !== index));
            return;
        }

        axios.delete(`/dashboard/data/${type}/${id}`)
            .then(() => {
                if (type === 'mutualFunds') setMutualFunds(mutualFunds.filter((_, i) => i !== index));
                if (type === 'otherAssets') setOtherAssets(otherAssets.filter((_, i) => i !== index));
                if (type === 'fixedIncomes') setFixedIncomes(fixedIncomes.filter((_, i) => i !== index));
                if (type === 'insurances') setInsurances(insurances.filter((_, i) => i !== index));

                alert("Deleted!")
            })
            .catch((error) => {
                console.error(`Error deleting ${type}:`, error);
                alert('Failed to delete item.');
            });
    };

    const addMutualFund = () => {
        setMutualFunds([...mutualFunds, { name: '', type: '', value: 0, transactions: '' }]);
    };

    const addOtherAsset = () => {
        setOtherAssets([...otherAssets, { type: '', value: 0 }]);
    };

    const addFixedIncome = () => {
        setFixedIncomes([...fixedIncomes, { type: '', value: 0 }]);
    };

    const addInsurance = () => {
        setInsurances([...insurances, { type: '', policy_number: 0 , expiry_date: '' }]);
    };

    const renderPortfolio = () => (
        <div>
            <h3 className="w3-text-black">Mutual Funds</h3>
            <table className="w3-table w3-bordered w3-striped w3-margin-bottom">
                <thead>
                    <tr>
                        <th>Fund Name</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Transactions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mutualFunds.map((fund, index) => (
                        <tr key={index}>
                            <td><input type="text" value={fund.name} onChange={(e) => {
                                const updatedFunds = [...mutualFunds];
                                updatedFunds[index].name = e.target.value;
                                setMutualFunds(updatedFunds);
                            }} /></td>
                            <td><input type="text" value={fund.type} onChange={(e) => {
                                const updatedFunds = [...mutualFunds];
                                updatedFunds[index].type = e.target.value;
                                setMutualFunds(updatedFunds);
                            }} /></td>
                            <td><input type="number" value={fund.value} onChange={(e) => {
                                const updatedFunds = [...mutualFunds];
                                updatedFunds[index].value = parseFloat(e.target.value);
                                setMutualFunds(updatedFunds);
                            }} /></td>
                            <td><input type="text" value={fund.transactions} onChange={(e) => {
                                const updatedFunds = [...mutualFunds];
                                updatedFunds[index].transactions = e.target.value;
                                setMutualFunds(updatedFunds);
                            }} /></td>
                            <td>
                                <button className="w3-button w3-red" onClick={() => deleteItem('mutualFunds', fund.id, index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="w3-button w3-blue w3-margin w3-right" onClick={addMutualFund}>Add Mutual Fund</button>
        </div>
    );

    const renderOtherAssets = () => (
        <div>
            <h3 className="w3-text-black">Other Assets</h3>
            <table className="w3-table w3-bordered w3-striped w3-margin-bottom">
                <thead>
                    <tr>
                        <th>Asset Type</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {otherAssets.map((asset, index) => (
                        <tr key={index}>
                            <td><input type="text" value={asset.type} onChange={(e) => {
                                const updatedAssets = [...otherAssets];
                                updatedAssets[index].type = e.target.value;
                                setOtherAssets(updatedAssets);
                            }} /></td>
                            <td><input type="number" value={asset.value} onChange={(e) => {
                                const updatedAssets = [...otherAssets];
                                updatedAssets[index].value = parseFloat(e.target.value);
                                setOtherAssets(updatedAssets);
                            }} /></td>
                            <td>
                                <button className="w3-button w3-red" onClick={() => deleteItem('otherAssets', asset.id, index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="w3-button w3-blue w3-margin w3-right" onClick={addOtherAsset}>Add Asset</button>
        </div>
    );

    const renderFixedIncome = () => (
        <div>
            <h3 className="w3-text-black">Fixed Income</h3>
            <table className="w3-table w3-bordered w3-striped w3-margin-bottom">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fixedIncomes.map((income, index) => (
                        <tr key={index}>
                            <td><input type="text" value={income.type} onChange={(e) => {
                                const updatedIncomes = [...fixedIncomes];
                                updatedIncomes[index].type = e.target.value;
                                setFixedIncomes(updatedIncomes);
                            }} /></td>
                            <td><input type="number" value={income.value} onChange={(e) => {
                                const updatedIncomes = [...fixedIncomes];
                                updatedIncomes[index].value = parseFloat(e.target.value);
                                setFixedIncomes(updatedIncomes);
                            }} /></td>
                            <td>
                                <button className="w3-button w3-red" onClick={() => deleteItem('fixedIncomes', income.id, index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="w3-button w3-blue w3-margin w3-right" onClick={addFixedIncome}>Add Fixed Income</button>
        </div>
    );

    const renderInsurance = () => (
        <div>
            <h3 className="w3-text-black">Insurance</h3>
            <table className="w3-table w3-bordered w3-striped w3-margin-bottom">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Policy Number</th>
                        <th>Expiry Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {insurances.map((insurance, index) => (
                        <tr key={index}>
                            <td><input type="text" value={insurance.type} onChange={(e) => {
                                const updatedInsurances = [...insurances];
                                updatedInsurances[index].type = e.target.value;
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td><input type="number" value={insurance.policy_number} onChange={(e) => {
                                const updatedInsurances = [...insurances];
                                updatedInsurances[index].policy_number = parseFloat(e.target.value);
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td><input type="date" value={insurance.expiry_date} onChange={(e) => {
                                const updatedInsurances = [...insurances];
                                updatedInsurances[index].expiry_date = e.target.value;
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td>
                                <button className="w3-button w3-red" onClick={() => deleteItem('insurances', insurance.id, index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="w3-button w3-blue w3-margin w3-right" onClick={addInsurance}>Add Insurance</button>
        </div>
    );

    const renderAddAssets = () => (
        <div>
            <h3 className="w3-text-black">Add/Upload Assets</h3>
            <table className="w3-table w3-bordered w3-striped">
                <thead>
                    <tr>
                        <th>Asset Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Bonds</td>
                        <td>Upload or add details of your bonds.</td>
                    </tr>
                    <tr>
                        <td>Insurance</td>
                        <td>Health, Life, or Vehicle insurance policies.</td>
                    </tr>
                    <tr>
                        <td>Fixed Deposits</td>
                        <td>Details of your fixed deposit accounts.</td>
                    </tr>
                    <tr>
                        <td>Post Office (PO)</td>
                        <td>Investments or savings in post office schemes.</td>
                    </tr>
                    <tr>
                        <td>Savings Account</td>
                        <td>Details of your savings accounts.</td>
                    </tr>
                    <tr>
                        <td>Current Account</td>
                        <td>Details of your current accounts.</td>
                    </tr>
                    <tr>
                        <td>PMS, AIF, NPS</td>
                        <td>Portfolio Management Services, Alternative Investment Funds, or National Pension Scheme.</td>
                    </tr>
                    <tr>
                        <td>Stocks</td>
                        <td>Details of your stocks with ISIN for auto-update.</td>
                    </tr>
                    <tr>
                        <td>Credit Cards</td>
                        <td>Details of your credit cards.</td>
                    </tr>
                    <tr>
                        <td>Loans</td>
                        <td>Home or personal loan details.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const renderFixedIncomeDropdown = () => (
        <div>
            <h3 className="w3-text-black">Fixed Income</h3>
            <select className="w3-select" onChange={(e) => setActiveTab(e.target.value)}>
                <option value="myBonds">My Bonds</option>
                <option value="addBonds">Add Existing Bonds</option>
            </select>
            <div>
                <label>
                    Fixed Deposit Interest Options:
                    <select className="w3-select">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                    </select>
                </label>
            </div>
        </div>
    );

    const renderInsuranceDropdown = () => (
        <div>
            <h3 className="w3-text-black">Insurance</h3>
            <select className="w3-select" onChange={(e) => setActiveTab(e.target.value)}>
                <option value="vehicleInsurance">Vehicle</option>
                <option value="healthInsurance">Health</option>
                <option value="lifeInsurance">Life</option>
                <option value="generalInsurance">General</option>
            </select>
            <p>Upload existing policy for the selected category.</p>
        </div>
    );

    const renderProfile = () => (
        <div>
            <h3 className="w3-text-black">My Profile</h3>
            <p>PAN, DOB, Email, and Mobile Number cannot be changed once submitted.</p>
            <button className="w3-button w3-blue w3-margin w3-right">Edit Profile</button>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'portfolio':
                return renderPortfolio();
            case 'otherAssets':
                return renderOtherAssets();
            case 'fixedIncome':
                return renderFixedIncome();
            case 'insurance':
                return renderInsurance();
            case 'addAssets':
                return renderAddAssets();
            case 'fixedIncomeDropdown':
                return renderFixedIncomeDropdown();
            case 'insuranceDropdown':
                return renderInsuranceDropdown();
            case 'profile':
                return renderProfile();
            default:
                return renderPortfolio();
        }
    };

    return (
        <W3Layout>
            <Head title="Dashboard" />
            { showModal && <CredentialCheckModal /> } 
            <div className="w3-container w3-padding-32">
                <h2 className="w3-center">Welcome to Your Dashboard</h2>
                <div className="w3-bar w3-light-grey w3-margin-bottom">
                    <button className={`w3-bar-item w3-button ${activeTab === 'portfolio' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('portfolio')}>Mutual Funds</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'otherAssets' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('otherAssets')}>Other Assets</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'fixedIncome' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('fixedIncome')}>Fixed Income</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'insurance' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('insurance')}>Insurance</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'profile' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('profile')}>My Profile</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'addAssets' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('addAssets')}>Add/Upload Assets</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'fixedIncomeDropdown' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('fixedIncomeDropdown')}>Fixed Income</button>
                    <button className={`w3-bar-item w3-button ${activeTab === 'insuranceDropdown' ? 'w3-blue' : ''}`} onClick={() => setActiveTab('insuranceDropdown')}>Insurance</button>
                </div>
                {renderContent()}
                <button className="w3-button w3-green w3-margin-top w3-right" onClick={saveData}>Save Changes</button>
            </div>
        </W3Layout>
    );
}
