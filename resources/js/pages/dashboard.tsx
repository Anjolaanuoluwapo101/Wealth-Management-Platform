import { Head } from '@inertiajs/react';
import W3Layout from '@/layouts/w3-layout';
import { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import CredentialCheckModal from '@/components/CredentialCheckModal';
import { type SharedData, DashboardSectionCardProps } from '@/types';
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
        transactions: number;
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
        policy_number: number,
        expiry_date: string
    }



    const DashboardSectionCard: React.FC<DashboardSectionCardProps> = ({ title, subtitle, children, addButton }) => (
        <div className="w3-section">
            <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                    <h3 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>{title}</h3>
                    {subtitle && <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>{subtitle}</span>}
                </div>
                <div className="w3-responsive">
                    {children}
                </div>
                {addButton && (
                    <div>
                        {addButton}
                        <div className="w3-clear"></div>
                    </div>
                )}
            </div>
        </div>
    );

    // Tab state
    const [activeTab, setActiveTab] = useState('portfolio');
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    //to trigger a rerender
    const [, forceUpdate] = useState(0);
    const rerender = () => {
        forceUpdate((prev) => prev + 1);
    }

    const mutualFunds = useRef<MutualFund[]>([]);
    const otherAssets = useRef<OtherAsset[]>([]);
    const fixedIncomes = useRef<fixedIncome[]>([]);
    const insurances = useRef<insurance[]>([]);

    const setMutualFunds = (data: MutualFund[]) => {
        mutualFunds.current = data;
    }

    const setOtherAssets = (data: OtherAsset[]) => {
        otherAssets.current = data;
    }
    const setFixedIncomes = (data: fixedIncome[]) => {
        fixedIncomes.current = data;
    }
    const setInsurances = (data: insurance[]) => {
        insurances.current = data;
    }



    const { auth } = usePage<SharedData>().props;
    const [showModal, setShowModal] = useState(true);

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: (File | { name: string; data: string; type: string; lastModified: number; })[] }>({});

    const assetTypes = [
        { key: 'Bonds', desc: 'Upload or add details of your bonds.' },
        { key: 'Insurance', desc: 'Health, Life, or Vehicle insurance policies.' },
        { key: 'Fixed Deposits', desc: 'Details of your fixed deposit accounts.' },
        { key: 'Post Office (PO)', desc: 'Investments or savings in post office schemes.' },
        { key: 'Savings Account', desc: 'Details of your savings accounts.' },
        { key: 'Current Account', desc: 'Details of your current accounts.' },
        { key: 'PMS, AIF, NPS', desc: 'Portfolio Management Services, Alternative Investment Funds, or National Pension Scheme.' },
        { key: 'Stocks', desc: 'Details of your stocks with ISIN for auto-update.' },
        { key: 'Credit Cards', desc: 'Details of your credit cards.' },
        { key: 'Loans', desc: 'Home or personal loan details.' },
    ];

    // Helper to generate a unique id
    const generateId = () => Date.now() + Math.floor(Math.random() * 1000000);

    // Utility to convert File to base64
    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    // Load files from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('uploadedFiles');
        if (stored) {
            setUploadedFiles(JSON.parse(stored));
        }
    }, []);

    // Save files to localStorage whenever uploadedFiles changes
    useEffect(() => {
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }, [uploadedFiles]);

    // Handle file upload (store as base64 in localStorage)
    const handleFileUpload = async (assetType: string, files: FileList | null) => {
        if (!files) return;
        const fileArr = Array.from(files);
        const base64Files = await Promise.all(
            fileArr.map(async (file) => ({
                name: file.name,
                data: await fileToBase64(file),
                type: file.type,
                lastModified: file.lastModified,
            }))
        );
        setUploadedFiles(prev => ({
            ...prev,
            [assetType]: [...(prev[assetType] || []), ...base64Files]
        }));
    };

    // Remove a file
    const handleRemoveFile = (assetType: string, index: number) => {
        setUploadedFiles(prev => ({
            ...prev,
            [assetType]: prev[assetType].filter((_, i) => i !== index)
        }));
    };


    //Confirm if the user has completed their credentials
    useEffect(() => {
        const { pan_card, kyc_verified, address_proof, bank_proof, self_photograph } = auth.user;
        console.log(auth.user);
        if (pan_card == null || kyc_verified == null || address_proof == null || bank_proof == null || self_photograph == null) {
            window.location.href = route('profile.edit');

        } else {
            setShowModal(false);
        }
    }, [auth.user]);

    //Load existing values
    useEffect(() => {
        axios.get('/dashboard/data')
            .then((response) => {
                const ensureIds = <T extends { id?: number }>(arr: T[]) =>
                    arr.map(item => ({ ...item, id: item.id ?? generateId() }));
                setMutualFunds(ensureIds(response.data.mutualFunds || []));
                setOtherAssets(ensureIds(response.data.otherAssets || []));
                setFixedIncomes(ensureIds(response.data.fixedIncomes || []));
                setInsurances(ensureIds(response.data.insurances || []));

                //forces a rerender
                rerender();
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
            });
    }, []);
    const saveData = () => {
        // Validation functions
        const validateMutualFund = (fund: any): boolean => {
            return typeof fund.name === 'string' &&
                typeof fund.type === 'string' &&
                typeof fund.value === 'number' &&
                typeof fund.transactions === 'number';
        };

        const validateOtherAsset = (asset: any): boolean => {
            return typeof asset.type === 'string' &&
                typeof asset.value === 'number';
        };

        const validateFixedIncome = (income: any): boolean => {
            return typeof income.type === 'string' &&
                typeof income.value === 'number';
        };

        // const validateInsurance = (insurance: any): boolean => {
        //     return typeof insurance.type === 'string' &&
        //         typeof insurance.policy_number === 'string' &&
        //         typeof insurance.expiry_date === 'string';
        // };

        // Validate all entries
        
        for (const fund of mutualFunds.current) {
            if (!validateMutualFund(fund)) {
                alert('Invalid data in Mutual Funds. Please check all entries.');
                return;
            }
        }

        for (const asset of otherAssets.current) {
            if (!validateOtherAsset(asset)) {
                alert('Invalid data in Other Assets. Please check all entries.');
                return;
            }
        }

        for (const income of fixedIncomes.current) {
            if (!validateFixedIncome(income)) {
                alert('Invalid data in Fixed Incomes. Please check all entries.');
                return;
            }
        }

        let mutualFundsData = mutualFunds.current;
        let otherAssetsData = otherAssets.current;
        let fixedIncomesData = fixedIncomes.current;
        let insurancesData = insurances.current;

        // Proceed with saving if all validations pass
        axios.post('/dashboard/data', {
            mutualFunds: mutualFundsData,
            otherAssets: otherAssetsData,
            fixedIncomes: fixedIncomesData,
            insurances: insurancesData,
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
            if (type === 'mutualFunds') setMutualFunds(mutualFunds.current.filter((_, i) => i !== index));
            if (type === 'otherAssets') setOtherAssets(otherAssets.current.filter((_, i) => i !== index));
            if (type === 'fixedIncomes') setFixedIncomes(fixedIncomes.current.filter((_, i) => i !== index));
            if (type === 'insurances') setInsurances(insurances.current.filter((_, i) => i !== index));
            return;
        }

        axios.delete(`/dashboard/data/${type}/${id}`)
            .then(() => {
                if (type === 'mutualFunds') setMutualFunds(mutualFunds.current.filter((_, i) => i !== index));
                if (type === 'otherAssets') setOtherAssets(otherAssets.current.filter((_, i) => i !== index));
                if (type === 'fixedIncomes') setFixedIncomes(fixedIncomes.current.filter((_, i) => i !== index));
                if (type === 'insurances') setInsurances(insurances.current.filter((_, i) => i !== index));

                alert("Deleted!")
            })
            .catch((error) => {
                console.error(`Error deleting ${type}:`, error);
                alert('Failed to delete item.');
            });
    };

    const addMutualFund = () => {
        setMutualFunds([...mutualFunds.current, { id: generateId(), name: '', type: '', value: 0, transactions: 0 }]);
        rerender();
    };

    const addOtherAsset = () => {
        setOtherAssets([...otherAssets.current, { id: generateId(), type: '', value: 0 }]);
        rerender();
    };

    const addFixedIncome = () => {
        setFixedIncomes([...fixedIncomes.current, { id: generateId(), type: '', value: 0 }]);
        rerender();
    };

    const addInsurance = () => {
        setInsurances([...insurances.current, { id: generateId(), type: '', policy_number: 0, expiry_date: '' }]);
        rerender();
    };

    const renderPortfolio = () => (
        <DashboardSectionCard
            title="Mutual Funds"
            subtitle="Track your mutual fund investments"
            addButton={
                <button
                    className="w3-button w3-theme w3-round w3-border w3-hover-amber w3-right"
                    style={{ marginTop: 8 }}
                    onClick={addMutualFund}
                >
                    <i className="fa fa-plus w3-margin-right"></i>Add Mutual Fund
                </button>
            }
        >
            <table className="w3-table w3-bordered w3-hoverable w3-striped w3-white w3-small w3-margin-bottom">
                <thead>
                    <tr className="w3-theme-l4">
                        <th className="w3-text-theme">Fund Name</th>
                        <th className="w3-text-theme">Type</th>
                        <th className="w3-text-theme">Value</th>
                        <th className="w3-text-theme">Transactions</th>
                        <th className="w3-text-theme">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mutualFunds.current.map((fund) => (
                        <tr key={fund.id}>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="text"
                                    defaultValue={fund.name}
                                    placeholder="Fund Name"

                                    onChange={(e) => {
                                        const updatedFunds = mutualFunds.current.map(f => f.id === fund.id ? { ...f, name: e.target.value } : f);
                                        // setMutualFunds(updatedFunds);
                                        // e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
                                        setMutualFunds(updatedFunds);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="text"
                                    defaultValue={fund.type}
                                    placeholder="Type"
                                    onChange={(e) => {
                                        const updatedFunds = mutualFunds.current.map(f => f.id === fund.id ? { ...f, type: e.target.value } : f);
                                        setMutualFunds(updatedFunds);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="number"
                                    defaultValue={fund.value}
                                    placeholder="Value"
                                    onChange={(e) => {
                                        const updatedFunds = mutualFunds.current.map(f => f.id === fund.id ? { ...f, value: parseFloat(e.target.value) } : f);
                                        setMutualFunds(updatedFunds);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="number"
                                    defaultValue={fund.transactions}
                                    placeholder="Transactions"
                                    onChange={(e) => {
                                        const updatedFunds = mutualFunds.current.map(f => f.id === fund.id ? { ...f, transactions: parseFloat(e.target.value) } : f);
                                        setMutualFunds(updatedFunds);
                                    }}
                                />
                            </td>
                            <td>
                                <button
                                    className="w3-button w3-round w3-border w3-hover-light-grey w3-text-red"
                                    style={{ padding: '4px 12px' }}
                                    onClick={() => {
                                            deleteItem('mutualFunds', fund.id, mutualFunds.current.findIndex(f => f.id === fund.id));
                                            rerender();
                                        }
                                    }
                                >
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardSectionCard>
    );

    const renderOtherAssets = () => (
        <DashboardSectionCard
            title="Other Assets"
            subtitle="Add your other assets here"
            addButton={
                <button
                    className="w3-button w3-theme w3-round w3-border w3-hover-amber w3-right"
                    style={{ marginTop: 8 }}
                    onClick={addOtherAsset}
                >
                    <i className="fa fa-plus w3-margin-right"></i>Add Asset
                </button>
            }
        >
            <table className="w3-table w3-bordered w3-hoverable w3-striped w3-white w3-small w3-margin-bottom">
                <thead>
                    <tr className="w3-theme-l4">
                        <th className="w3-text-theme">Asset Type</th>
                        <th className="w3-text-theme">Value</th>
                        <th className="w3-text-theme">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {otherAssets.current.map((asset) => (
                        <tr key={asset.id}>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="text"
                                    defaultValue={asset.type}
                                    placeholder="Asset Type"
                                    onChange={(e) => {
                                        const updatedAssets = otherAssets.current.map(a => a.id === asset.id ? { ...a, type: e.target.value } : a);
                                        setOtherAssets(updatedAssets);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="number"
                                    defaultValue={asset.value}
                                    placeholder="Value"
                                    onChange={(e) => {
                                        const updatedAssets = otherAssets.current.map(a => a.id === asset.id ? { ...a, value: parseFloat(e.target.value) } : a);
                                        setOtherAssets(updatedAssets);
                                    }}
                                />
                            </td>
                            <td>
                                <button
                                    className="w3-button w3-round w3-border w3-hover-light-grey w3-text-red"
                                    style={{ padding: '4px 12px' }}
                                    onClick={() => deleteItem('otherAssets', asset.id, otherAssets.current.findIndex(a => a.id === asset.id))}
                                >
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardSectionCard>
    );

    const renderFixedIncome = () => (
        <DashboardSectionCard
            title="Other Assets"
            subtitle="Add your other assets here"
            addButton={
                <button
                    className="w3-button w3-theme w3-round w3-border w3-hover-amber w3-right"
                    style={{ marginTop: 8 }}
                    onClick={addFixedIncome}
                >
                    <i className="fa fa-plus w3-margin-right"></i>Add Fixed Income
                </button>
            }
        >
            <table className="w3-table w3-bordered w3-hoverable w3-striped w3-white w3-small w3-margin-bottom">
                <thead>
                    <tr className="w3-theme-l4">
                        <th className="w3-text-theme">Type</th>
                        <th className="w3-text-theme">Value</th>
                        <th className="w3-text-theme">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fixedIncomes.current.map((income) => (
                        <tr key={income.id}>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="text"
                                    defaultValue={income.type}
                                    placeholder="Type"
                                    onChange={(e) => {
                                        const updatedIncomes = fixedIncomes.current.map(i => i.id === income.id ? { ...i, type: e.target.value } : i);
                                        setFixedIncomes(updatedIncomes);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    className="w3-input w3-border w3-round"
                                    type="number"
                                    defaultValue={income.value}
                                    placeholder="Value"
                                    onChange={(e) => {
                                        const updatedIncomes = fixedIncomes.current.map(i => i.id === income.id ? { ...i, value: parseFloat(e.target.value) } : i);
                                        setFixedIncomes(updatedIncomes);
                                    }}
                                />
                            </td>
                            <td>
                                <button
                                    className="w3-button w3-round w3-border w3-hover-light-grey w3-text-red"
                                    style={{ padding: '4px 12px' }}
                                    onClick={() => deleteItem('fixedIncomes', income.id, fixedIncomes.current.findIndex(i => i.id === income.id))}
                                >
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w3-clear"></div>
        </DashboardSectionCard>
    );

    const renderInsurance = () => (
        <DashboardSectionCard
            title="Other Assets"
            subtitle="Add your other assets here"
            addButton={
                <button className="w3-button w3-theme w3-round w3-border w3-hover-amber w3-right" onClick={addInsurance}>Add Insurance</button>
            }
        >
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
                    {insurances.current.map((insurance) => (
                        <tr key={insurance.id}>
                            <td><input type="text" defaultValue={insurance.type} onChange={(e) => {
                                const updatedInsurances = insurances.current.map(ins => ins.id === insurance.id ? { ...ins, type: e.target.value } : ins);
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td><input type="number" defaultValue={insurance.policy_number} onChange={(e) => {
                                const updatedInsurances = insurances.current.map(ins => ins.id === insurance.id ? { ...ins, policy_number: parseFloat(e.target.value) } : ins);
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td><input type="date" defaultValue={insurance.expiry_date} onChange={(e) => {
                                const updatedInsurances = insurances.current.map(ins => ins.id === insurance.id ? { ...ins, expiry_date: e.target.value } : ins);
                                setInsurances(updatedInsurances);
                            }} /></td>
                            <td>
                                <button className="w3-button w3-red" onClick={() => deleteItem('insurances', insurance.id, insurances.current.findIndex(ins => ins.id === insurance.id))}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardSectionCard>
    );

    const renderAddAssets = () => (
        <DashboardSectionCard
            title="Add/Upload Assets(Files are stored in browser)"
            subtitle="Upload and manage your asset documents (PDF only, stored in browser)"
        >
            <table className="w3-table w3-bordered w3-striped w3-white w3-small">
                <thead>
                    <tr>
                        <th>Asset Type</th>
                        <th>Description</th>
                        <th>Upload PDF</th>
                        <th>Uploaded Files</th>
                    </tr>
                </thead>
                <tbody>
                    {assetTypes.map(asset => (
                        <tr key={asset.key}>
                            <td>{asset.key}</td>
                            <td>{asset.desc}</td>
                            <td>
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        style={{ width: '160px' }}
                                        onChange={e => handleFileUpload(asset.key, e.target.files)}
                                    />
                                </form>
                            </td>
                            <td>
                                {(uploadedFiles[asset.key] || []).length === 0 && (
                                    <span className="w3-text-grey w3-small">No files</span>
                                )}
                                {(uploadedFiles[asset.key] || []).map((file: any, idx: number) => (
                                    <div key={idx} className="w3-margin-bottom">
                                        <a
                                            href={file.data}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w3-text-theme"
                                            style={{ marginRight: 8 }}
                                        >
                                            {file.name}
                                        </a>
                                        <button
                                            type="button"
                                            className="w3-button w3-tiny w3-round w3-border w3-hover-red w3-text-red"
                                            onClick={() => handleRemoveFile(asset.key, idx)}
                                            style={{ padding: '2px 8px' }}
                                        >
                                            <i className="fa fa-trash"> Delete </i>
                                        </button>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardSectionCard>
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
        <W3Layout >
            <Head title="Dashboard" />
            {showModal && <CredentialCheckModal />}
            <div className="w3-container w3-padding-32">
                <div>
                    <h2 className="w3-center">Welcome to Your Dashboard</h2>
                    <div
                        className="w3-bar w3-white w3-card w3-round-large w3-padding-small w3-margin-bottom"
                        style={{ overflowX: 'auto', border: '1px solid #eee' }}
                    >
                        {[
                            { key: 'portfolio', label: 'Mutual Funds' },
                            { key: 'otherAssets', label: 'Other Assets' },
                            { key: 'fixedIncome', label: 'Fixed Income' },
                            // { key: 'insurance', label: 'Insurance' },
                            // { key: 'profile', label: 'My Profile' },
                            { key: 'addAssets', label: 'Add/Upload Assets' },
                            { key: 'fixedIncomeDropdown', label: 'Fixed Income' },
                            { key: 'insuranceDropdown', label: 'Insurance' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`w3-bar-item w3-button w3-round-large w3-hover-theme w3-hover-text-white ${activeTab === tab.key ? 'w3-theme w3-text-white' : 'w3-text-theme'}`}
                                style={{
                                    margin: '0 4px',
                                    fontWeight: activeTab === tab.key ? 600 : 400,
                                    boxShadow: activeTab === tab.key ? '0 2px 8px rgba(255,193,7,0.15)' : undefined,
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {renderContent()}
                </div>
                <button className="w3-button w3-theme w3-round w3-border w3-hover-amber w3-right" onClick={saveData}>Save Changes</button>
            </div>
        </W3Layout >
    );
}
