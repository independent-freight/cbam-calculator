export const formatCommodityCodesDropdown = (data) =>
    data.map((item) => ({
        value: `${item?.code} - ${item?.description}`,
        label: `${item?.code} - ${item?.description}`,
    }));
