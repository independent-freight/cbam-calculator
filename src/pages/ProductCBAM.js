import { getProductCBAMListAsync } from "apis/productsAPI";
import { Button } from "components/Button";
import { Card } from "components/Card";
import { Pagination } from "components/Pagination";
import { Text } from "components/Text";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProductCBAM, updateListPage } from "state/productCBAMSlice";

export function ProductCBAM() {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [products, pagination] = useSelector((state) => [
        state.productCBAM.data,
        state.productCBAM.pagination,
    ]);

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
        setUpProductCBAM(pagination?.page, pagination?.limit);
    }, [pagination.page, pagination?.limit]);

    const handlePageChange = (number) => {
        dispatch(updateListPage(number));
    };
    const handleAddProduct = () => {
        navigation("/product-cbam/add");
    };
    return (
        <div className='min-w-screen h-screen flex items-center justify-center'>
            {products?.length <= 0 ? (
                <div className='flex flex-col'>
                    <Text type='body'>
                        No Product CBAM calculations have been made. Click here
                        to add.
                    </Text>
                    <Button
                        onClick={handleAddProduct}
                        label='Add Product'
                        className='w-[150px] m-auto mt-[10px]'
                    />
                </div>
            ) : (
                products.map((item, index) => {
                    return <Card key={`${index}-product-cbam`}></Card>;
                })
            )}
            <Pagination
                currentPage={pagination?.page}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
