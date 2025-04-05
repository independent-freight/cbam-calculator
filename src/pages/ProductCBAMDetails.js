import { getCBAMDetailsAsync } from "apis/productsAPI";
import { CBAMGuide } from "components/CBAMGuide";
import { Loader } from "components/Loader";
import { Table } from "components/Table";
import { Text } from "components/Text";
import {
    formatCBAMDetails,
    formatEmailCalculations,
    formatNumber,
    formatProductName,
} from "helpers/formatData";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCBAMDetails } from "state/productCBAMSlice";
import productsCNCode from "assets/commodity-codes.json";
import { BarChart } from "components/BarChart";
import { LineChart } from "components/LineChart";
import { AppHeader } from "layout/AppHeader";
import "App.css";
import html2pdf from "html2pdf.js";
import { Download, Mail } from "lucide-react";
import { sendCalculationEmailAsync } from "apis/emailAPI";
import { PRODUCT_CBAM_URL } from "assets/appUrls";
import { Button } from "components/Button";

export function ProductCBAMDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cbamDetails = useSelector(
        (state) => state.productCBAM?.details?.[id]
    );

    const [isLoading, setLoading] = useState(false);
    const [isEmailLoading, setEmailLoading] = useState(false);
    const [emptyState, setEmptyState] = useState("");

    const setupCBAMDetails = async (id) => {
        let response = await getCBAMDetailsAsync(id);
        if (!response?.error) {
            dispatch(updateCBAMDetails({ id, data: { ...response?.data } }));
        } else {
            setEmptyState("The Product's CBAM calculation is not found.");
        }
        setTimeout(() => setLoading(false), 500);
    };

    const getCBAMTableSubHeader = (data = []) => {
        let subData = data.reduce(
            (acc, row) => {
                acc.see_direct = formatNumber(acc.see_direct + row?.see_direct);
                acc.see_indirect = formatNumber(
                    acc.see_indirect + row?.see_indirect
                );
                acc.see_total = formatNumber(acc.see_total + row?.see_total);

                acc.emb_em_direct = formatNumber(
                    acc.emb_em_direct + row?.emb_em_direct
                );

                acc.emb_em_indirect = formatNumber(
                    acc.emb_em_indirect + row?.emb_em_indirect
                );

                acc.emb_em_total = formatNumber(
                    acc.emb_em_total + row?.emb_em_total
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
        setLoading(true);
        if (id && !cbamDetails) {
            setupCBAMDetails(id);
        } else setLoading(false);
    }, [id]);

    const formattedCBAM = useMemo(() => {
        return formatCBAMDetails(
            cbamDetails?.results,
            cbamDetails?.production_process?.material_category,
            cbamDetails?.production_process?.electricity_source
        );
    }, [cbamDetails]);

    const handleGoBack = () => navigate(PRODUCT_CBAM_URL);

    const supplierEmissionChart = () => {
        return (cbamDetails?.results ?? [])
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
    const handleDownload = () => {
        const table = document.getElementById("download-pdf");
        if (!table) {
            console.error("Table not found");
            return;
        }
        const opt = {
            margin: 0.2,
            filename: `${cbamDetails?.production_process?.product_cn_code} - CBAM-Table.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3 },
            jsPDF: { unit: "in", format: "a3", orientation: "landscape" },
        };
        html2pdf().from(table).set(opt).save();
    };

    const sendCalculationEmail = async () => {
        setEmailLoading(true);
        let response = await sendCalculationEmailAsync(
            {
                description: `${
                    cbamDetails?.production_process?.product_cn_code
                } - ${formatProductName(
                    cbamDetails?.production_process?.material_category,
                    cbamDetails?.production_process?.product_cn_code
                )}`,
            },
            formatEmailCalculations(formattedCBAM)
        );
        if (response?.error)
            alert(
                "Failed to send the calculation summary to your email. Please try again after some time."
            );
        else {
            alert(
                "Successfully send the summary of the calculations to your email. Please check your email. "
            );
        }
        setEmailLoading(false);
    };
    return (
        <div
            className={
                emptyState
                    ? "flex justify-center items-center flex-col min-h-[100%]"
                    : ""
            }>
            {emptyState ? (
                <div>
                    <Text type='semiBold-body'>{emptyState}</Text>
                    <Button
                        style='mt-[10px]'
                        label='Go back'
                        onClick={handleGoBack}
                    />
                </div>
            ) : (
                <>
                    {isLoading || !cbamDetails ? (
                        <Loader />
                    ) : (
                        <>
                            <div className='flex justify-between items-center mr-[20px] cursor-pointer'>
                                <AppHeader
                                    header={`EU CBAM Report: ${
                                        cbamDetails?.production_process
                                            ?.product_cn_code
                                    } - ${
                                        productsCNCode[
                                            cbamDetails?.production_process
                                                ?.material_category
                                        ]?.find(
                                            (item) =>
                                                item?.code ===
                                                cbamDetails?.production_process
                                                    ?.product_cn_code
                                        )?.description
                                    }`}
                                    showBack
                                    onBackClick={handleGoBack}
                                />
                                <div className='flex gap-2'>
                                    {isEmailLoading ? (
                                        <Loader
                                            className='!min-h-[10px]'
                                            size={25}
                                        />
                                    ) : (
                                        <>
                                            <Mail
                                                size={26}
                                                onClick={
                                                    !isEmailLoading &&
                                                    sendCalculationEmail
                                                }
                                            />

                                            <Download
                                                size={25}
                                                onClick={handleDownload}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='w-full xs-max-w-md ssm-max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl my-[40px] mx-auto'>
                                <div id='download-pdf'>
                                    <Table
                                        data={formattedCBAM}
                                        columns={columns}
                                    />
                                    <CBAMGuide />
                                </div>

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
                        </>
                    )}
                </>
            )}
        </div>
    );
}
