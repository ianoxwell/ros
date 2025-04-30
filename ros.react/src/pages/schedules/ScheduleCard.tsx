import { useAppDispatch } from '@app/hooks';
import { setCurrentSchedule } from '@components/GlobalNavigation/globalModal.slice';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { ActionIcon, Avatar, Button, Card, ComboboxItem, Group, HoverCard, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { getDateFromIndex, getDateIndex } from '@utils/dateUtils';
import dayjs from 'dayjs';
import { Coffee, CookingPot, Donut, Edit, Plus, Popcorn, Sandwich, Utensils } from 'lucide-react';
import parse from 'html-react-parser';
import { pickATime } from './schedule.const';
import ScheduleRecipe from './ScheduleRecipe';

const ScheduleCard = ({ schedules, dateStr }: { schedules: ISchedule[]; dateStr: string }) => {
  const dispatch = useAppDispatch();
  const date = dayjs(getDateFromIndex(dateStr));

  const editItem = (item: ISchedule) => {
    dispatch(setCurrentSchedule({ ...item, date: getDateIndex(item.date) }));
  };

  const newItem = (slot: ComboboxItem, dateIndex: string) => {
    dispatch(
      setCurrentSchedule({ date: dateIndex, timeSlot: slot.value as ETimeSlot, scheduleRecipes: [], notes: '' })
    );
  };

  const slotTimeAvatar = (slot: ETimeSlot) => {
    const iconSize = 16;
    // const avatarSize = 'sm'
    switch (slot) {
      case ETimeSlot.BREAKFAST:
        return <Utensils size={iconSize} />;
      case ETimeSlot.LUNCH:
        return <Sandwich size={iconSize} />;
      case ETimeSlot.DINNER:
        return <CookingPot size={iconSize} />;
      case ETimeSlot.MORNING_SNACK:
        return <Coffee size={iconSize} />;
      case ETimeSlot.AFTERNOON_SNACK:
        return <Donut size={iconSize} />;
      default:
        return <Popcorn size={iconSize} />;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="schedule-item">
      <div className="schedule-item--day">{date.format('dddd')}</div>
      <div className="schedule-item--date">{date.format('MMMM D, YYYY')}</div>
      {pickATime.map((slot) => {
        const slotItem = schedules.find((schedule) => schedule.timeSlot === slot.value);
        return (
          <section key={randomId()}>
            <div className="schedule-item--slot">
              <HoverCard>
                <HoverCard.Target>
                  <Group gap="xs">
                    <Avatar color="var(--accent-foreground)" radius="xl" size="sm" variant="filled">
                      {slotTimeAvatar(slot.value as ETimeSlot)}
                    </Avatar>
                    <span>{slot.label}</span>
                  </Group>
                </HoverCard.Target>
                {!!slotItem?.notes && (
                  <HoverCard.Dropdown>
                    <Text>{parse(slotItem.notes)}</Text>
                  </HoverCard.Dropdown>
                )}
              </HoverCard>

              {!!slotItem?.scheduleRecipes.length && (
                <ActionIcon title={`Edit ${slot.label} items`} variant="transparent" onClick={() => editItem(slotItem)}>
                  <Edit size={16} />
                </ActionIcon>
              )}
            </div>
            {!slotItem?.scheduleRecipes.length && (
              <div className="add-more--button">
                <Button
                  type="button"
                  leftSection={<Plus size={20} />}
                  onClick={() => newItem(slot, dateStr)}
                  title="New"
                  variant="outline"
                >
                  Add {slot.label.toLowerCase()} recipes
                </Button>
              </div>
            )}
            {slotItem && (
              <ScheduleRecipe
                scheduleRecipes={slotItem.scheduleRecipes}
                slotItem={slotItem}
                key={slotItem.id || randomId()}
              />
            )}
          </section>
        );
      })}
    </Card>
  );
};

export default ScheduleCard;
