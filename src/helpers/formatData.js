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
