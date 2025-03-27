import { Text } from "components/Text";

export function AppHeader({ header }) {
    return (
        <Text className='text-left' type='semiBold-header'>
            {header}
        </Text>
    );
}
