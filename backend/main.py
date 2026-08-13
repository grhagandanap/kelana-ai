# function to print trip summary
from services.trip_service import get_trip_category, get_travel_season, calculate_daily_budget, recommendation_place 

def print_trip_summary(destination, days, budget, currency, travel_month):
    
    print(30*"=")
    print("\nKelanaAI\n")
    print(30*"=")
    
    print(f"Destination : {destination}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget:.0f} {currency}")
    print(f"Category    : {get_trip_category(budget)}")
    print(f"Daily Budget: {calculate_daily_budget(budget, days):.0f} {currency}")
    print(f"Travel Month: {travel_month}")
    print(f"Season      : {get_travel_season(travel_month)}")
    print(f"\nRecommended Places:")
    for place in recommendation_place(destination):
        print(f" - {place}")


destination     = input("Enter destination: ")
country         = input("Enter country: ")
days            = int(input("Enter days: "))
budget          = float(input("Enter budget: "))
currency        = input("Enter currency: ")
travel_month    = input("Enter travel month: ")

# invoke function
print_trip_summary(destination, days, budget, currency, travel_month)