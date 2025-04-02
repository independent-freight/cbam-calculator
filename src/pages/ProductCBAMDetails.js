import { getCBAMDetailsAsync } from "apis/productsAPI";
import { CBAMGuide } from "components/CBAMGuide";
import { Loader } from "components/Loader";
import { Table } from "components/Table";
import { Text } from "components/Text";
import { formatCBAMDetails } from "helpers/formatData";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateCBAMDetails } from "state/productCBAMSlice";
import productsCNCode from "assets/commodity-codes.json";
import { BarChart } from "components/BarChart";
import LineChart from "components/LineChart";

export function ProductCBAMDetails() {
    const { id } = useParams();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cbamDetails = useSelector(
        (state) => state.productCBAM?.details?.[id] ?? { results: [] }
    );

    const [isLoading, setLoading] = useState(false);
    const setupCBAMDetails = async (id) => {
        setLoading(true);
        let response = await getCBAMDetailsAsync(id);
        dispatch(updateCBAMDetails({ id, data: { ...response?.data } }));
        setTimeout(() => setLoading(false), 500);
    };
    const formatNumber = (number) => Number(number).toFixed(3);

    const getCBAMTableSubHeader = (data = []) => {
        let subData = data.reduce(
            (acc, row) => {
                acc.see_direct = Number(
                    formatNumber(acc.see_direct + row?.see_direct)
                );
                acc.see_indirect = Number(
                    formatNumber(acc.see_indirect + row?.see_indirect)
                );
                acc.see_total = Number(
                    formatNumber(acc.see_total + row?.see_total)
                );
                acc.emb_em_direct = Number(
                    formatNumber(acc.emb_em_direct + row?.emb_em_direct)
                );
                acc.emb_em_indirect = Number(
                    formatNumber(acc.emb_em_indirect + row?.emb_em_indirect)
                );
                acc.emb_em_total = Number(
                    formatNumber(acc.emb_em_total + row?.emb_em_total)
                );
                return acc;
            },
            {
                total_product_process: "Total Production Process",
                mass_share: "-",
                default_value: "0%",
                see_direct: 0,
                see_indirect: 0,
                see_total: 0,
                emb_em_direct: 0,
                emb_em_indirect: 0,
                emb_em_total: 0,
                electrictiy_source: "-",
                embedded_electricity: "-",
                country_code: "-",
            }
        );
        return Object.values(subData).map((info, key) => ({
            label: info,
            colSpan: key === 0 ? 2 : 1,
        }));
    };

    const columns = [
        [
            {
                label: "Product Information",
                colSpan: 2,
                color: "bg-gray-200",
                key: "custom-name-product_material",
            },
            { label: "Mass share t/t", key: "mass_share" },
            { label: "(Share of)\nDefault value", key: "default_value" },
            { label: "SEE (direct)\ntCO2e/t", key: "see_direct" },
            { label: "SEE (indirect)\ntCO2e/t", key: "see_indirect" },
            { label: "SEE (total)\ntCO2e/t", key: "see_total" },
            { label: "EmbEm (direct)\ntCO2e", key: "emb_em_direct" },
            { label: "EmbEm (indirect)\ntCO2e", key: "emb_em_indirect" },
            { label: "EmbEm (total)\ntCO2e", key: "emb_em_total" },
            { label: "Source of electricity EF", key: "electricity_source" },
            {
                label: "Embedded Electricity\nMWh/t",
                key: "embedded_electricity",
            },
            { label: "Country Code", key: "country_code" },
        ],
        [...getCBAMTableSubHeader(cbamDetails?.results)],
    ];

    useEffect(() => {
        if (id && !state) {
            setupCBAMDetails(id);
        }
    }, [id]);

    const formattedCBAM = useMemo(() => {
        return formatCBAMDetails(
            cbamDetails?.results,
            cbamDetails?.production_process?.material_category,
            cbamDetails?.production_process?.electricity_source
        );
    }, [cbamDetails]);

    const handleGoBack = () => navigate("/product-cbam");

    const supplierEmissionChart = () => {
        return cbamDetails.results
            .filter((item) => item?.is_supplier)
            .map((item) => ({
                ...item,
                quantity: item?.emb_em_total / item?.see_total,
            }));
    };
    const supplierBars = [
        { key: "emb_em_total", name: "Emissions (tCO2e/t)", color: "#8884d8" },
        { key: "quantity", name: "Quantity (tonnes)", color: "#82ca9d" },
    ];
    const emissionLines = [
        {
            key: "see_indirect",
            color: "#8884d8",
            name: "See Indirect (tCO2e/t)",
        },
        { key: "see_direct", color: "#82c99d", name: "See Direct (tCO2e/t)" },
    ];
    return (
        <div className='m-[20px]'>
            <div className='flex justify-between items-center'>
                <ChevronLeft
                    size={30}
                    onClick={handleGoBack}
                    className='cursor-pointer'
                />
                <Text type='semiBold-subHeader' className='flex-1 text-center'>
                    EU CBAM Report:{" "}
                    {cbamDetails?.production_process?.product_cn_code}
                    {" - "}
                    {
                        productsCNCode[
                            cbamDetails?.production_process?.material_category
                        ]?.find(
                            (item) =>
                                item?.code ===
                                cbamDetails?.production_process?.product_cn_code
                        )?.description
                    }
                </Text>
            </div>
            {isLoading && cbamDetails ? (
                <Loader />
            ) : (
                <div className='w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl my-[40px] mx-auto'>
                    <Table data={formattedCBAM} columns={columns} />
                    <CBAMGuide />
                    <div className='flex justify-between my-[20px]'>
                        <div className='h-64 flex-1'>
                            <Text type='semiBold-body'>
                                Supply Chain Carbon Map
                            </Text>
                            <BarChart
                                data={supplierEmissionChart()}
                                bars={supplierBars}
                            />
                        </div>{" "}
                        <div className='h-64 flex-1 '>
                            <Text type='semiBold-body'>
                                Emissions Breakdown
                            </Text>
                            <LineChart
                                data={formattedCBAM}
                                lines={emissionLines}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
