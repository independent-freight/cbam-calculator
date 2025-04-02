import productMaterials from "assets/product-materials.json";
import commodityCodes from "assets/commodity-codes.json";
export const formatCommodityCodesDropdown = (data) =>
    data.map((item) => ({
        value: item?.code,
        label: `${item?.code} - ${item?.description}`,
    }));

export const formatCBAMDetails = (
    data = [],
    material_category,
    electricity_source
) => {
    let product_material = productMaterials.find(
        (material) => material?.value === material_category
    );
    let productName = (code) =>
        commodityCodes[material_category]?.find((item) => item?.code === code);
    return data.map((item, index) => ({
        ...item,
        name: item?.is_supplier
            ? item?.name
            : productName(item?.name)?.description,
        product_material: product_material?.value
            ? product_material?.extra_label ?? product_material?.label
            : "-",
        electricity_source:
            index === 0 && electricity_source ? electricity_source : "Mix",
    }));
};
