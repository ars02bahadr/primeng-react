'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import {
    AutoComplete,
    AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Carousel } from 'primereact/carousel';
import { Image } from 'primereact/image';
import { ProductService } from '../../demo/service/ProductService';
import type { Demo } from '@/types';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { ProgressBar } from 'primereact/progressbar';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { CustomerService } from '../../demo/service/CustomerService';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Rating } from 'primereact/rating';


const EmptyPage = () => {

    const toast = useRef<Toast | null>(null);

    const onUpload = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
            life: 3000
        });
    };

    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [images, setImages] = useState<Demo.Photo[]>([]);
    const [allExpanded, setAllExpanded] = useState(false);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
    const carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const carouselItemTemplate = (product: Demo.Product) => {
        return (
            <div className="border-1 surface-border border-round m-1 text-center py-5">
                <div className="mb-3">
                    <img src={`/demo/images/product/${product.image}`} alt={product.name} className="w-6 shadow-2" />
                </div>
                <div>
                    <h4 className="p-mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <span className={`product-badge status-${product.inventoryStatus?.toLowerCase()}`}>{product.inventoryStatus}</span>
                    <div className="car-buttons mt-5">
                        <Button type="button" className="mr-2" rounded icon="pi pi-search"></Button>
                        <Button type="button" className="mr-2" severity="success" rounded icon="pi pi-star"></Button>
                        <Button type="button" severity="help" rounded icon="pi pi-cog"></Button>
                    </div>
                </div>
            </div>
        );
    };

    

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];


    const [customers2, setCustomers2] = useState<Demo.Customer[]>([]);
    const [customers3, setCustomers3] = useState<Demo.Customer[]>([]);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);

    

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));

        initFilters1();
    }, []);

    const balanceTemplate = (rowData: Demo.Customer) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.balance as number)}</span>
            </div>
        );
    };

    const getCustomers = (data: Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = d.date ? new Date(d.date) : new Date();
            return d;
        });
    };

    const formatDate = (value: Date) => {
        if (value && value instanceof Date && !isNaN(value.getTime())) {
            return value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        return '';
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const countryBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const representativeBodyTemplate = (rowData: Demo.Customer) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`/demo/images/avatar/${representative.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <>
                <div className="mb-3 text-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </>
        );
    };

    const representativesItemTemplate = (option: any) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.balance as number);
    };

    const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const activityBodyTemplate = (rowData: Demo.Customer) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };

    const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const verifiedBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified
                })}
            ></i>
        );
    };

    const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {} as { [key: string]: boolean };
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows([]);
        setAllExpanded(false);
    };

    const amountBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.amount as number);
    };

    const statusOrderBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`order-badge order-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return <img src={`/demo/images/product/${rowData.image}`} onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="shadow-2" width={100} />;
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return formatCurrency(rowData.price as number);
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate2 = (rowData: Demo.Product) => {
        return <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    };

    const rowExpansionTemplate = (data: Demo.Product) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />;

    const headerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt={data.representative.name} src={`/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="font-bold ml-2">{data.representative.name}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <td colSpan={4} style={{ textAlign: 'right' }} className="text-bold pr-6">
                    Total Customers
                </td>
                <td>{calculateCustomerTotal(data.representative.name)}</td>
            </React.Fragment>
        );
    };

    const calculateCustomerTotal = (name: string) => {
        let total = 0;

        if (customers3) {
            for (let customer of customers3) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    };

    const header1 = renderHeader1(); 

    const [visible, setVisible] = useState(false);
    
    
    

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid">
                        <h5>Vertical</h5>
                        <div className="field">
                            <label htmlFor="name1">Name</label>
                            <InputText id="name1" type="text" />
                        </div>
                        <div className="fied">
                        <label htmlFor="number1">Number</label>
                        <InputNumber
                            showButtons
                            mode="decimal"
                        ></InputNumber>
                        </div>
                        <div className="field">
                            <label htmlFor="email1">Email</label>
                            <InputText id="email1" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="age1">Age</label>
                            <InputText id="age1" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="gender1">Gender</label>
                            <RadioButton id="gender1" name="gender" value="male" />
                            <RadioButton id="gender2" name="gender" value="female" />
                        </div>
                        <div className="field">
                            <label htmlFor="accept1">Accept</label>
                            <Checkbox
                                        inputId="checkOption1"
                                        name="option"
                                        value="Chicago"
                                        checked={true}
                                    />
                        </div>
                        <div className="field">
                            <label htmlFor="note1">Note</label>
                            <InputTextarea
                            placeholder="Your Message"
                            rows={5}
                            cols={30}
                        />
                        
                        </div>
                        <div className="field">
                            <label htmlFor="country1">Calendar</label>
                            <Calendar
                            showIcon
                            showButtonBar
                            
                        />
                        </div>
                        <div className="field">
                            <label htmlFor="country1">MultiSelect</label>
                            <MultiSelect
                            optionLabel="name"
                            placeholder="Select a Country"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="country1">AutoComplete</label>
                            <AutoComplete
                            placeholder="Search"
                            id="dd"
                            dropdown
                            multiple
                            ></AutoComplete>
                        </div>
                        <div className="field">
                            <label htmlFor="country1">Dropdown</label>
                            <Dropdown
                            optionLabel="name"
                            placeholder="Select a Country"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="country1">Carousel</label>
                            <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                        </div>
                        <div className="field">
                            <label htmlFor="country1">Image</label>
                            <Image src={`/demo/images/galleria/galleria10.jpg`} alt="Image" width="250" preview />
                        </div>
                </div>
                <div className="card">
                        <Button label="Primary" icon="pi pi-check" rounded/>
                        <Button label="Secondary" icon="pi pi-bookmark" rounded severity="secondary" />
                        <Button label="Success" icon="pi pi-search" rounded severity="success" />
                        <Button label="Info" icon="pi pi-user" rounded severity="info" />
                        <Button label="Warning" icon="pi pi-bell" rounded severity="warning" />
                        <Button label="Help" icon="pi pi-heart" rounded severity="help" />
                </div>
                <div className="card">
                    <DataTable
                            value={customers1}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="id"
                            filters={filters1}
                            filterDisplay="menu"
                            loading={loading1}
                            responsiveLayout="scroll"
                            emptyMessage="No customers found."
                            header={header1}
                        >
                            <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                            <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" filterClear={filterClearTemplate} filterApply={filterApplyTemplate} />
                            <Column
                                header="Agent"
                                filterField="representative"
                                showFilterMatchModes={false}
                                filterMenuStyle={{ width: '14rem' }}
                                style={{ minWidth: '14rem' }}
                                body={representativeBodyTemplate}
                                filter
                                filterElement={representativeFilterTemplate}
                            />
                            <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                            <Column header="Balance" filterField="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                            <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                            <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
                            <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                    </DataTable>
                </div>
                <div className='card'>
                    <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                    <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Dialog>
                </div>
                <div className='card'>
                    <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple  maxFileSize={1000000} />
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
