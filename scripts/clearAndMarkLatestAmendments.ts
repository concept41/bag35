import { markLatestAmendmentForFilers, removeLatestAmendmentLabelForFilers } from "./utils/markLatestAmendment";

/**
 * marks the latest amendment for each filing period for all filers
 * 
 */
export const clearAndMarkLatestAmendments = async () => {
  console.log('running clearAndMarkLatestAmendments()');
  console.log('clearing LATEST_AMENDMENT label for all filers');
  await removeLatestAmendmentLabelForFilers();
  console.log('determining and marking latest amendments for all filers');
  await markLatestAmendmentForFilers();
}

clearAndMarkLatestAmendments();
