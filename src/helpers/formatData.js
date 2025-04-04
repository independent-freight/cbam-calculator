import productMaterials from "assets/product-materials.json";
import commodityCodes from "assets/commodity-codes.json";
export const formatCommodityCodesDropdown = (data) =>
    data.map((item) => ({
        value: item?.code,
        label: `${item?.code} - ${item?.description}`,
    }));

export const formatMaterialCategoryName = (key) => {
    let prdMaterial = productMaterials.find(
        (material) => material?.value === key
    );
    return prdMaterial?.extra_label ?? prdMaterial?.label;
};

export const formatProductName = (category, code) =>
    commodityCodes[category]?.find((item) => item?.code === code)?.description;

export const formatCBAMDetails = (
    data = [],
    material_category,
    electricity_source = ""
) => {
    let product_material = formatMaterialCategoryName(material_category);
    let productName = (code) => formatProductName(material_category, code);
    return data.map((item, index) => ({
        ...item,
        name: item?.is_supplier ? item?.name : productName(item?.name),
        product_material: product_material ?? "-",
        electricity_source:
            index === 0 && electricity_source ? electricity_source : "Mix",
    }));
};
export const formatNumber = (number, limit) =>
    Number(Number(number).toFixed(limit ?? 3));

export const formatEmailCalculations = (data) => {
    return data.reduce(
        (acc, curr) => {
            acc.see_product_total += formatNumber(
                curr?.see_direct + curr?.see_indirect
            );

            if (curr?.is_supplier) {
                acc.see_direct_supplier = formatNumber(
                    acc.see_direct_supplier + curr?.see_direct
                );
                acc.see_total_suppliers += formatNumber(
                    curr?.see_direct + curr?.see_indirect
                );
            } else {
                acc.see_total = formatNumber(
                    curr?.see_direct + curr?.see_indirect
                );
                acc.see_indirect = curr?.see_indirect;
                acc.see_direct = curr?.see_direct;
            }

            return acc;
        },
        {
            see_product_total: 0,
            see_direct_supplier: 0,
            see_total_suppliers: 0,
            see_total: 0,
            see_indirect: 0,
            see_direct: 0,
        }
    );
};
