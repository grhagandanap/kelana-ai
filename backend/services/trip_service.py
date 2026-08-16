def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif 1000<= budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

def get_travel_season(month):
    if month == "December":
        return "Peak Season"
    elif month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"

def calculate_daily_budget(budget, days):
    return budget/days

def recommendation_place(destination):
    if destination == "Japan":
        return ['Tokyo Tower', 'Shibuya', 'Mount Fuji']

def recommendation_transportation(category):
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    elif category == "Luxury":
        return "Flight"
    else:
        return "Unknown"
