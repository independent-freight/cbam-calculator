import { useDispatch, useSelector } from "react-redux";
import { AppHeader } from "layout/AppHeader";
import { KPISection } from "./KPISection";
import { TrendingUp, Factory, Package } from "lucide-react";
import { getProductKPIAsync } from "apis/productsAPI";
import { useEffect } from "react";
import { updateDashboard } from "state/productCBAMSlice";
import { formatMaterialCategoryName } from "helpers/formatData";
import { ProductCBAM } from "./ProductCBAM";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";

export function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const kpi = useSelector((state) => state.productCBAM.dashboard);
    const productPagination = useSelector(
        (state) => state.productCBAM.pagination
    );
    const navigate = useNavigate();

    const setupDashboard = async () => {
        let response = await getProductKPIAsync();
        dispatch(updateDashboard(response?.data));
    };
    useEffect(() => {
        if (Object.keys(kpi).length <= 0) setupDashboard();
    }, [kpi]);

    const handleViewAll = () => navigate("/product-cbam");

    return (
        <div className='min-h-[100%] h-[100%]'>
            <AppHeader header={`Welcome ${user?.full_name ?? ""},`} />

            <KPISection
                sections={[
                    {
                        title: "Total CBAM Emissions",
                        value: kpi?.totalCBAMEmissions
                            ? `${kpi?.totalCBAMEmissions} tCO2e/t`
                            : "-",
                        icon: TrendingUp,
                        bgColor: "bg-red-500",
                    },
                    {
                        title: "Top Emitting Product",
                        value:
                            formatMaterialCategoryName(
                                kpi?.topEmittingProduct
                            ) ?? "-",
                        icon: Factory,
                        bgColor: "bg-blue-500",
                    },
                    {
                        title: "Total Supplier Quantity",
                        value: kpi?.totalSupplierQuantity
                            ? `${kpi?.totalSupplierQuantity} tonnes`
                            : "-",
                        icon: Package,
                        bgColor: "bg-green-500",
                    },
                ]}
            />
            <ProductCBAM
                headerType='semiBold-subHeader'
                showPagination={false}
                path='/'
            />
            {productPagination?.totalPages > 1 && (
                <Button
                    label='View more'
                    onClick={handleViewAll}
                    style={"w-[150px] mx-[auto] my-[20]"}
                />
            )}
        </div>
    );
}
