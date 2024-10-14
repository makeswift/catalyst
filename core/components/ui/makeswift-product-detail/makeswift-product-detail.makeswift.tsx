import { Checkbox, Slot, Style } from '@makeswift/runtime/controls';

import { MakeswiftProductDetail } from '~/components/ui/makeswift-product-detail';
import { runtime } from '~/lib/makeswift/runtime';

export const MAKESWIFT_PRODUCT_DETAIL_TYPE = 'catalyst-box';

runtime.registerComponent(MakeswiftProductDetail, {
  type: MAKESWIFT_PRODUCT_DETAIL_TYPE,
  label: 'Catalyst / Makeswift Product Detail',
  props: {
    className: Style(),
    content: Slot(),
    show: Checkbox({ defaultValue: false, label: 'Enable product detail (wip)' }),
  },
});
