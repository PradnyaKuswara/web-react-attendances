import type { Role } from '@/@types/role';
import { useGetAllRoles } from '@/rests/admin/roles/useGetAllRoles';
import Select, { type SingleValue } from 'react-select';

type RoleOption = {
  value: number;
  label: string;
};

interface SelectRoleProps {
  field: {
    value: number | null;
    onChange: (value: number | null) => void;
  };
  isDisabled?: boolean;
}

const SelectRole = ({ field, isDisabled = false }: SelectRoleProps) => {
  const { data: roles = [], isLoading: isLoadingRoles } = useGetAllRoles();

  const options: RoleOption[] = roles.map((role: Role) => ({
    value: role.id,
    label: role.name,
  }));

  const selectedOption = options.find((opt) => opt.value === field.value) ?? null;

  const handleChange = (option: SingleValue<RoleOption>) => {
    field.onChange(option?.value ?? null);
  };

  return (
    <Select<RoleOption, false>
      options={options}
      value={selectedOption}
      onChange={handleChange}
      isLoading={isLoadingRoles}
      isDisabled={isDisabled || isLoadingRoles}
      placeholder="Pilih role..."
      classNamePrefix="react-select"
      isClearable
    />
  );
};

export default SelectRole;