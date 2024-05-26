import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
import { ButtonGroup, Flex, IconButton, useEditableControls } from "@chakra-ui/react"

export default function EditableControls() {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
        <ButtonGroup justifyContent='center' size='sm'>
            <IconButton aria-label="Submit" type="submit" icon={<CheckIcon />} {...getSubmitButtonProps()} />
            <IconButton aria-label="Cancel" icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
    ) : (
        <Flex justifyContent='center'>
            <IconButton aria-label="Edit" colorScheme="blue" size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
        </Flex>
    )
}