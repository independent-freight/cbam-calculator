import { Text } from "components/Text";

export function AppHeader({ header }) {
    return (
        <Text className='text-left mx-[50px] my-[20px]' type='semiBold-header'>
            {header}
        </Text>
    );
}
