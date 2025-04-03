import { getProductCBAMListAsync } from "apis/productsAPI";
import { Button } from "components/Button";
import { Card } from "components/Card";
import { Pagination } from "components/Pagination";
import { Text } from "components/Text";
import {
    formatCBAMDetails,
    formatMaterialCategoryName,
    formatNumber,
    formatProductName,
} from "helpers/formatData";
import { AppHeader } from "layout/AppHeader";
import { ChevronRight, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setProductCBAM,
    updateCBAMDetails,
    updateListPage,
} from "state/productCBAMSlice";

export function ProductCBAM() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector((state) => state.productCBAM.data);
    const pagination = useSelector((state) => state.productCBAM.pagination);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    const setUpProductCBAM = async (page, limit) => {
        let response = await getProductCBAMListAsync(page, limit);
        if (response?.data) dispatch(setProductCBAM(response?.data));
    };
    useEffect(() => {
        if (products?.length < 0) {
            setUpProductCBAM(pagination?.page, pagination?.limit);
        }
    }, [products]);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 980);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        setUpProductCBAM(pagination?.page, pagination?.limit);
    }, [pagination.page, pagination?.limit]);

    const handlePageChange = (number) => {
        dispatch(updateListPage(number));
    };
    const handleAddProduct = () => {
        navigate("/product-cbam/add");
    };

    const setCardValues = (info) => {
        const { product_cn_code, material_category, annual_production } =
            info?.production_process;
        const { total_quantity, name } = info?.suppliers.reduce(
            (acc, curr) => {
                acc.total_quantity += curr?.quantity;
                acc.name += `${acc?.name ? ", " : ""}${curr?.name}`;
                return acc;
            },
            { total_quantity: 0, name: "" }
        );
        const { see_direct, see_indirect, total_carbon_emissions } =
            info?.results?.reduce(
                (acc, curr) => {
                    acc.total_carbon_emissions = formatNumber(
                        acc.total_carbon_emissions + curr?.emb_em_direct,
                        2
                    );
                    acc.see_indirect = formatNumber(
                        acc.see_indirect + curr?.see_indirect,
                        2
                    );
                    acc.see_direct = formatNumber(
                        acc.see_direct + curr?.see_direct,
                        2
                    );
                    return acc;
                },
                {
                    see_direct: 0,
                    see_indirect: 0,
                    total_carbon_emissions: 0,
                }
            );
        return {
            product_cn_code: `${product_cn_code} - ${formatProductName(
                material_category,
                product_cn_code
            )}`,
            total_carbon_emissions: total_carbon_emissions + " tCO2e",
            total_subcontractors: info?.subcontractors?.filter(
                (item) => item?.name
            )?.length,
            total_material_quantity: total_quantity + " tonnes",
            annual_production: annual_production + " tonnes",
            material_category: formatMaterialCategoryName(material_category),
            suppliers: name,
            see_indirect: see_indirect + " tCO2e/t",
            see_direct: see_direct + " tCO2e/t",
        };
    };

    const cardLabels = useMemo(() => {
        return (cardData) => {
            const cardValues = setCardValues(cardData);
            return [
                {
                    label: "Product Code/Name",
                    key: "production_process",
                    value: cardValues?.product_cn_code,
                },
                {
                    label: "Total Carbon Emissions",
                    key: "results",
                    value: cardValues?.total_carbon_emissions,
                },
                {
                    label: "Total Subcontractors",
                    key: "subcontractors",
                    value: cardValues?.total_subcontractors,
                    hide: isSmallScreen,
                },
                {
                    label: "Total Material Quantity",
                    key: "suppliers",
                    value: cardValues?.total_material_quantity,
                },
                {
                    label: "Annual Production",
                    key: "production_process",
                    value: cardValues?.annual_production,
                },
                {
                    label: "Material Category",
                    value: cardValues?.material_category,
                    hide: isSmallScreen,
                },
                {
                    label: "Suppliers (Name)",
                    key: "suppliers",
                    value: cardValues?.suppliers,
                    hide: isSmallScreen,
                },
                {
                    label: "SEE Direct Emissions",
                    value: cardValues?.see_direct,
                },
                {
                    label: "SEE Indirect Emissions",
                    value: cardValues?.see_indirect,
                },
            ];
        };
    }, [isSmallScreen]);
    const handleDetailsView = (data) => {
        dispatch(updateCBAMDetails({ id: data?._id, data }));
        navigate(`/product-cbam/${data?._id}`, { state: data });
    };
    return (
        <div className={`w-full h-screen flex flex-col`}>
            <AppHeader
                header="Your Product's CBAM Calculations"
                rightHeader={
                    products?.length > 0 && (
                        <PlusCircle
                            size={30}
                            color='#2563ea'
                            className='cursor-pointer'
                            onClick={handleAddProduct}
                        />
                    )
                }
            />

            <div
                className={`min-w-screen min-h-screen h-screen flex flex-col ${
                    products?.length <= 0
                        ? "items-center  justify-center"
                        : "items-start"
                } pb-[20px]`}>
                {products?.length <= 0 ? (
                    <div className='flex flex-col'>
                        <Text type='body'>
                            No Product CBAM calculations have been made. Click
                            here to add.
                        </Text>
                        <Button
                            onClick={handleAddProduct}
                            label='Add Product'
                            className='w-[150px] m-auto mt-[10px]'
                        />
                    </div>
                ) : (
                    products.map((item, index) => {
                        return (
                            <Card
                                onClick={() => handleDetailsView(item)}
                                key={`${index}-product-cbam`}
                                className='flex xl:!max-w-[1000px] lg:!max-w-[800px] md:!max-w-[500px] cursor-pointer mx-[40px] mb-[20px] items-center justify-between mx-auto bg-white shadow-lg rounded-2xl p-6 border-t border-gray-300'>
                                <div className='flex flex-wrap flex-1'>
                                    {cardLabels?.(item).map(
                                        (content, subIndex) => {
                                            if (!content?.hide)
                                                return (
                                                    <CardLabel
                                                        key={`${index}-${subIndex}`}
                                                        label={content?.label}
                                                        value={content?.value}
                                                    />
                                                );
                                        }
                                    )}
                                </div>
                                <ChevronRight size={30} />
                            </Card>
                        );
                    })
                )}
                <Pagination
                    currentPage={pagination?.page}
                    totalPages={pagination?.totalPages ?? 1}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

function CardLabel({ label, value }) {
    return (
        <div className='m-[10px]'>
            <Text type='semiBold-label'>{label}:</Text>
            <Text>{value} </Text>
        </div>
    );
}
