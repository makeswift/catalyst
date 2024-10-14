import { List, Select, Shape, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { Accordions } from '~/components/ui/accordions';
import { runtime } from '~/lib/makeswift/runtime';

export const ACCORDION_COMPONENT_TYPE = 'catalyst-accordion';

runtime.registerComponent(Accordions, {
  type: ACCORDION_COMPONENT_TYPE,
  label: 'Catalyst / Accordion',
  props: {
    className: Style(),
    text: TextInput({ defaultValue: 'FAQ' }),
    accordions: List({
      label: 'Accordions',
      type: Shape({
        type: {
          content: Slot(),
          title: TextInput({
            label: 'Title',
            defaultValue: 'Lorem Ipsum?',
            placeholder: 'Unique value',
          }),
        },
      }),
      getItemLabel() {
        return 'Slot';
      },
    }),
    type: Select({
      label: 'Type',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Multiple', value: 'multiple' },
      ],
      defaultValue: 'single',
    }),
  },
});
